interface AppManager {
    activate(name: string): void
    isActivated(name: string): boolean
    log(message: string): void
  }
  
  abstract class App {
    abstract event: {
      on(name: string, cb: (...args: any[]) => void): void
      off(name: string): void
    }
    constructor(public methods: string[]) {}
  
    call(method: string) {
      if (this.methods.includes(method)) {
        if (this[method]) {
          return this[method]()
        } else {
          throw new Error(`Method ${method} is exposed, but not implemented`)
        }
      } else {
        throw new Error(`Method ${method} is not exposed`)
      }
    }
  
  }
  
  class ApplicationRegistry {
    plugins: Record<string, App>
    constructor(private manager: AppManager) {}
  
    register(name: string, app: App) {
      this.plugins[name] = app
      this.manager.activate(name)
    }
  
    call(name: string, method: string) {
      try {
        if (this.manager.isActivated(name)) {
          return this.plugins[name].call(method)
        }
      } catch (err) {
        this.manager.log(err)
      }
    }
  
    on(name: string, event: string, cb: (...args: any[]) => void) {
      if (this.manager.isActivated(name)) {
        return this.plugins[name].event.on(event, cb)
      }
    }
  
    off(name: string, event: string) {
      if (this.manager.isActivated(name)) {
        return this.plugins[name].event.off(event)
      }
    }
  }

  export {  AppManager, App, ApplicationRegistry }