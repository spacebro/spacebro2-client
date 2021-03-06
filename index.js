'use strict'

const WebSocket = require('ws')

const defaults = {
  host: '127.0.0.1',
  port: 9375,
  autoReconnect: true
}

const events = []

let ws = null
let reconnectTimeout = null

function setup (options) {
  const opt = {...defaults, ...options}

  const queries = opt.name ? `name=${opt.name}` : ''

  ws = new WebSocket(`ws://${opt.host}:${opt.port}/?${queries}`)

  ws.on('open', function open () {
    clearTimeout(reconnectTimeout)
  })

  ws.on('message', function incoming (raw) {
    let eventName = 'default'
    let data = null
    let from = 'none'

    try {
      const obj = JSON.parse(raw)

      eventName = obj.eventName
      data = obj.data
      from = obj.from
    } catch (e) {
      data = raw
    }

    console.log('---')
    console.log(`event ${eventName} from ${from}`)
    console.log(data)

    if (typeof events[eventName] === 'function') {
      events[eventName](data, from)
    }
  })

  ws.on('error', function error (error) {
    // console.log(error)
  })

  ws.on('close', function closing (code) {
    console.log('socket closed')
    if (opt.autoReconnect) {
      reconnectTimeout = setTimeout(() => {
        console.log('reconnecting...')
        setup(opt)
      }, 500)
    }
  })
}

function emit (eventName, data, to) {
  try {
    const payload = JSON.stringify({ eventName, data, to })
    ws.send(payload)
  } catch (e) {
    console.log(e)
  }
}

function on (eventName, callback) {
  events[eventName] = callback
}

module.exports = { setup, emit, on }
