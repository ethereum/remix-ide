'use strict'

var request = require('xhr-request')

module.exports = (methodIdentifiers) => {
  return verifySignatureAsync(methodIdentifiers)
}

async function verifySignatureAsync (methodIdentifiers) {
  var collisions = []
  for (let func in methodIdentifiers) {
    var signature = methodIdentifiers[func]
    var url = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/' + signature
    request(url, (err, data, response) => {
      if (err) {
        console.log(err)
      } else if (response.statusCode === 200 && (data.split(';').length > 1 || data !== func)) {
        collisions.push(func)
      }
    })
  }
  return collisions
}
