const express = require('express')
const router = express.Router()

const transactions = require('./transactions')
const accounts = require('./accounts')
const customers = require('./customers')

router.use(accounts)
router.use(transactions)
router.use(customers)

module.exports = router
