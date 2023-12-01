const express = require('express')
const router = express.Router()
const controller = require('../app/controller')
const passport = require('../utils/passport')
const { auth } = require('../utils/jwt')

router.post('/auth/login', controller.auth.login)
router.post('/auth/register', controller.auth.register)
router.get('/auth/authenticate', auth, controller.auth.whoami)

//view
router.get('/register', (req, res) => {
  res.render('register.ejs')
})
router.post('/register', controller.auth.registerForm)

router.get('/login', (req, res) => {
  res.render('login.ejs')
})
// router.post('/login', controller.auth.loginForm)

router.get('/forgetPassword', (req, res) => {
  res.render('forgetPassword.ejs')
})
router.post('/forgetPassword', controller.auth.forgetPassword)

router.get('/resetPassword/:token', (req, res) => {
  const { token } = req.params
  res.render('resetPassword.ejs', { token })
})
router.post('/resetPassword/:token', controller.auth.resetPassword)

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


module.exports = router