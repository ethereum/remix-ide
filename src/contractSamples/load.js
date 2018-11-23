const fs = require('fs')
const path = require('path')
const contractsPath = path.join(__dirname, '../../node_modules/openzeppelin-solidity/contracts')
const ctrs = require('./ctrs.js')

const ctrDetail = (origin) => ({
  origin,
  content: fs.readFileSync(path.join(contractsPath, origin + '.sol')).toString().replace(/`/g, '\\`')
})

const line = origin => `export const ${origin.split('/').pop()} = ${JSON.stringify(ctrDetail(origin))}\n`

fs.writeFileSync(path.join(__dirname, 'index.js'), ctrs.map(line).join(''))
