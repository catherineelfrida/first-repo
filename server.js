const Sentry = require("@sentry/node")
const { ProfilingIntegration } = require("@sentry/profiling-node")
const express = require('express')
const swaggerJSON = require('./openapi.json')
const swaggerUI = require('swagger-ui-express')
const path = require('path')
const flash = require('express-flash')
const session = require("express-session")
const passport = require('./utils/passport')
const morgan=require('morgan')

const app = express()
const port = 3000
const routers = require('./router')

app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended:false })) //req.body untuk form data
app.use(session({ // config middleware session
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}))
app.use(flash()) // register flash middleware ke express -> req.flash
app.use(passport.initialize());
app.use(passport.session())

app.set("view engine", "ejs"); // register ejs sebagai view engine flash
app.set("views", path.join(__dirname, './app/view')) // mengubah folder views ke 
// app view

Sentry.init({
  dsn: 'https://48992ad1c3165e10e7c492852002617c@o4506303591874560.ingest.sentry.io/4506303599935488',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))
app.use(routers)

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
  console.log(`Server run at http://localhost:${port}`)
})

module.exports = app