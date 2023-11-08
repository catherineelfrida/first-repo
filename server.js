const express = require('express')
const swaggerJSON = require('./openapi.json')
const swaggerUI = require('swagger-ui-express')
const path = require('path')
const flash = require('express-flash')
const session = require("express-session")

const app = express()
const port = 3000
const routers = require('./router')

app.use(express.json())
app.use(express.urlencoded({ extended:false })) //req.body untuk form data
app.use(session({ // config middleware session
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}))
app.use(flash()) // register flash middleware ke express -> req.flash
// app.use(passport.initialize());
// app.use(passport.session())

app.set("view engine", "ejs"); // register ejs sebagai view engine flash
app.set("views", path.join(__dirname, './app/view')) // mengubah folder views ke 
// app view

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))
app.use('/api/v1', routers)

app.listen(port, () => {
  console.log(`Server run at http://localhost:${port}`)
})

module.exports = app