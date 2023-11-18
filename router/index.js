const express = require('express')
const router = express.Router()

const transactions = require('./transactions')
const accounts = require('./accounts')
const customers = require('./customers')
const auth = require('./auth')
const media = require('./media')
const profilephoto = require('./profilephoto')

router.use('/api/v1', accounts)
router.use('/api/v1', transactions)
router.use('/api/v1', customers)
router.use(auth)
router.use(media)
router.use(profilephoto)

module.exports = router
