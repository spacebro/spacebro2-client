# spacebro2-client

### Example connection

```js
'use strict'

const client = require('spacebro2-client')

client.setup({ name: 'client-name' })

client.on('image-event', (data, from) => {
  console.log(`received ${data} from ${from}`)
})

setTimeout(() => {
  client.emit('test-event', 'hello world')
}, 2000)
```
