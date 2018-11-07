/* global electron */
const spawn = require('child_process').spawn

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const options = {
  env: process.env,
  stdio: 'inherit',
  shell: true
}
const muon = spawn('electron', [__dirname, ...process.argv.slice(2)], options)

muon.on('error', (err) => {
  console.error(`could not start electron ${err}`)
})

muon.on('exit', (code, signal) => {
  console.log(`process exited with code ${code}`)
  process.exit(code)
})

muon.on('SIGTERM', () => {
  electron.kill('SIGTERM')
})

muon.on('SIGINT', () => {
  electron.kill('SIGINT')
})
