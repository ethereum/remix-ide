'use strict'

var request = require('xhr-request')

function verifySignature (methodIdentifiers) {
  return new Promise((resolve, reject) => {
    var collisions = []
    var keys = Object.keys(methodIdentifiers)
    keys.forEach(
      (func, index, array) => {
        let signature = methodIdentifiers[func]
        let url = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/' + signature
        request(url, (err, data, response) => {
          if (err) {
            console.log(err)
          } else if (response.statusCode === 200 && (data.split(';').length > 1 || data !== func)) {
            collisions.push(func)
            if (index === keys.length - 1) {
              resolve(collisions)
            }
          }
        })
      }
    )
  })
}

module.exports = verifySignature
