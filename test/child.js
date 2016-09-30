'use strict'

const Lock = require('../src')

let lock
let lk
let isPortable
let file

process.on('message', (msg) => {
  console.log('messag', msg)
  if (msg.type === 'init') {
    isPortable = msg.args.isPortable
    file = msg.args.file
    lock = Lock(isPortable)
    process.send({})
  } else if (!lock) {
    process.send({error: 'No init'})
  } else if (msg.type === 'lock') {
    lock(file, (err, _lk) => {
      lk = _lk
      process.send({err})
    })
  } else if (msg.type === 'unlock') {
    lk.close((err) => {
      process.send({err})
    })
  } else if (msg.type === 'exit') {
    process.send({})
    process.exit(0)
  }
})

