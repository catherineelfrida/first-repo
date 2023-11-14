const express = require('express')
const controller = require('../app/controller')
const passport = require('../utils/passport')

const router = express.Router()

router.post('/auth/login', controller.auth.login)
router.post('/auth/register', controller.auth.register)

//view
//register
router.get('/register', (req, res) => {
  res.render('register.ejs')
})
router.post('/register', controller.auth.registerForm)

//login
router.get('/login', (req, res) => {
  res.render('login.ejs')
})
// router.post('/login', controller.auth.loginForm)

// integrasikan passport ke router
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}))

// router.get('/auth/google', 
//   passportOAUTH.authenticate('google', {
//       scope: ['profile', 'email']
//   })
// )
// router.get('/auth/google/callback', 
//   passportOAUTH.authenticate('google', {
//       failureRedirect: '/login',
//       session: false
//   }), controller.auth.oauth
// )

// const passportOAUTH = require('../utils/oauth');

const { auth } = require('../utils/jwt')
router.get('/auth/authenticate', auth, controller.auth.whoami)

module.exports = router