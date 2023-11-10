const express = require('express')
const controller = require('../app/controller')
const { auth } = 
require('../utils/jwt')

const router = express.Router()

router.get('/users', controller.customers.get)
router.get('/users/:id', controller.customers.getById)
router.post('/users', auth, controller.customers.create)
// router.put('/customers/:id', controller.customers.update)
// router.delete('/customers/:id', controller.customers.destroy)

module.exports = router