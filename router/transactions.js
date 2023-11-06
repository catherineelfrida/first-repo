const express = require('express')
const controller = require('../app/controller')

const router = express.Router()

router.get('/transactions', controller.transactions.get)
router.get('/transactions/:id', controller.transactions.getById)
router.post('/transactions/deposit', controller.transactions.deposit) 
router.post('/transactions/withdraw', controller.transactions.withdraw)
router.post('/transactions/transfer', controller.transactions.transfer)

module.exports = router