/* global localStorage, fetch */
import { PluginManager, IframePlugin } from '@remixproject/engine'
import { EventEmitter } from 'events'
import QueryParams from './lib/query-params'
import { PermissionHandler } from './app/ui/persmission-handler'

const requiredModules = [ // services + layout views + system views
  'manager', 'compilerArtefacts', 'compilerMetadata', 'contextualListener', 'editor', 'offsetToLineColumnConverter', 'network', 'theme', 'fileManager', 'contentImport', 'web3Provider', 'scriptRunner', 'fetchAndCompile',
  'mainPanel', 'hiddenPanel', 'sidePanel', 'menuicons', 'fileExplorers',
  'terminal', 'settings', 'pluginManager']

export function isNative (name) {
  const nativePlugins = ['vyper', 'workshops']
  return nativePlugins.includes(name) || requiredModules.includes(name)
}

export function canActivate (name) {
  return ['manager', 'debugger', 'ethdoc'].includes(name)
}

export class RemixAppManager extends PluginManager {

  constructor (blockchain) {
    super()
    this.blockchain = blockchain
    this.event = new EventEmitter()
    this.pluginsDirectory = 'https://raw.githubusercontent.com/ethereum/remix-plugins-directory/master/build/metadata.json'
    this.pluginLoader = new PluginLoader()
    this.permissionHandler = new PermissionHandler()
  }

  async canActivate (from, to) {
    return canActivate(from.name)
  }

  async canDeactivate (from, to) {
    return from.name === 'manager'
  }

  async canCall (from, to, method, message) {
    // Make sure the caller of this methods is the target plugin
    if (to !== this.currentRequest.from) {
      return false
    }
    // skipping native plugins' requests
    if (isNative(from)) {
      return true
    }
    // ask the user for permission
    return await this.permissionHandler.askPermission(this.profiles[from], this.profiles[to], method, message)
  }

  onPluginActivated (plugin) {
    this.pluginLoader.set(plugin, this.actives)
    this.event.emit('activate', plugin)
    if (plugin.kind === 'provider') {
      ((plugin, app) => {
        const web3Provider = {
          sendAsync (payload, callback) {
            console.log('wallet connect', payload)
            app.call(plugin.name, 'sendAsync', payload)
              .then(result => {
                console.log('wallet connect', result)
                callback(null, result)
              })
              .catch(e => {
                console.log('wallet connect', e)
                callback(e)
              })
          }
        }
        app.blockchain.addWeb3Provider(plugin.displayName, web3Provider)
      })(plugin, this)
    }
  }

  getAll () {
    return Object.keys(this.profiles).map((p) => {
      return this.profiles[p]
    })
  }

  getIds () {
    return Object.keys(this.profiles)
  }

  onPluginDeactivated (plugin) {
    this.pluginLoader.set(plugin, this.actives)
    this.event.emit('deactivate', plugin)
    if (plugin.kind === 'provider') this.blockchain.removeWeb3Provider(plugin.name)
  }

  onRegistration (plugin) {
    this.event.emit('added', plugin.name)
  }

  async ensureActivated (apiName) {
    await this.activatePlugin(apiName)
    this.event.emit('ensureActivated', apiName)
  }

  async ensureDeactivated (apiName) {
    await this.deactivatePlugin(apiName)
    this.event.emit('ensureDeactivated', apiName)
  }

  deactivatePlugin (name) {
    if (requiredModules.includes(name)) return
    super.deactivatePlugin(name)
  }

  isRequired (name) {
    return requiredModules.includes(name)
  }

  async registeredPlugins () {
    const res = await fetch(this.pluginsDirectory)
    let plugins = await res.json()
    plugins.push({
      'name': 'walletconnect',
      'kind': 'provider',
      'displayName': 'Wallet Connect',
      'events': [],
      'methods': ['sendAsync'],
      'url': 'http://localhost:3000',
      'description': 'Browser & searcher for Ethereum smart contracts',
      'icon': 'data:image/png;base64,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',
      'location': 'mainPanel'
    })
    return plugins.map(plugin => new IframePlugin(plugin))
  }
}

/** @class Reference loaders.
 *  A loader is a get,set based object which load a workspace from a defined sources.
 *  (localStorage, queryParams)
 **/
class PluginLoader {
  get currentLoader () {
    return this.loaders[this.current]
  }

  constructor () {
    const queryParams = new QueryParams()
    this.donotAutoReload = ['remixd'] // that would be a bad practice to force loading some plugins at page load.
    this.loaders = {}
    this.loaders['localStorage'] = {
      set: (plugin, actives) => {
        if (!this.donotAutoReload.includes(plugin.name)) {
          localStorage.setItem('workspace', JSON.stringify(actives))
        }
      },
      get: () => { return JSON.parse(localStorage.getItem('workspace')) }
    }

    this.loaders['queryParams'] = {
      set: () => {},
      get: () => {
        const { plugins } = queryParams.get()
        if (!plugins) return []
        return plugins.split(',')
      }
    }

    this.current = queryParams.get()['plugins'] ? 'queryParams' : 'localStorage'
  }

  set (plugin, actives) {
    this.currentLoader.set(plugin, actives)
  }

  get () {
    return this.currentLoader.get()
  }
}
