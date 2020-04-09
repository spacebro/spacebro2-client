# spacebro2-client

### Example connection

```js
'use strict'

const client = require('spacebro2-client')

client.setup({ name: 'client-name' })

setTimeout(() => {
  client.emit('test-event', 'hello world')
}, 2000)
```
