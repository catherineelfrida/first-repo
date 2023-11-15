const express = require('express')
const router = express.Router()

const transactions = require('./transactions')
const accounts = require('./accounts')
const customers = require('./customers')
const auth = require('./auth')
const media = require('./media')

router.use('/api/v1', accounts)
router.use('/api/v1', transactions)
router.use('/api/v1', customers)
router.use(auth)
router.use(media)

module.exports = router
