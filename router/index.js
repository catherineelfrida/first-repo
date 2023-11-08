const express = require('express')
const router = express.Router()

const transactions = require('./transactions')
const accounts = require('./accounts')
const customers = require('./customers')
const auth = require('./auth')

router.use(accounts)
router.use(transactions)
router.use(customers)
router.use(auth)

module.exports = router
