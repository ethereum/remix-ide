const ctrSamples = require('./contractSamples')

const loadContractSamples = () => {
  if (!window.udapp) {
    window.console.log('not ready')
    return
  }
  const fileProvider = udapp._components.registry.get("fileproviders/browser")

  Object.keys(ctrSamples).map(ctrName => {
    fileProvider.api.set(ctrSamples[ctrName].origin + '.sol', ctrSamples[ctrName].content)
  })
}
module.exports = loadContractSamples
