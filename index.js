'use strict'

const WebSocket = require('ws')

const defaults = {
  host: '127.0.0.1',
  port: 9375,
  autoReconnect: true
}

let ws = null
let reconnectTimeout = null

function setup (options) {
  const opt = {...defaults, ...options}

  const queries = opt.name ? `name=${opt.name}` : ''

  ws = new WebSocket(`ws://${opt.host}:${opt.port}/?${queries}`)

  ws.on('open', function open () {
    clearTimeout(reconnectTimeout)
  })

  ws.on('message', function incoming (data) {
    console.log(data)
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

function emit (event, data) {
  try {
    const payload = JSON.stringify({ event, data })
    ws.send(payload)
  } catch (e) {
    console.log(e)
  }
}

module.exports = { setup, emit }
