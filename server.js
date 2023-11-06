const express = require('express')
const swaggerJSON = require('./openapi.json')
const swaggerUI = require('swagger-ui-express')

const app = express()
const port = 3000
const routers = require('./router')

app.use(express.json())

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))
app.use('/api/v1', routers)

app.listen(port, () => {
  console.log(`Server run at http://localhost:${port}`)
})
