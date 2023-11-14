const express = require('express')
const controller = require('../app/controller')

const router = express.Router()

router.get('/accounts', controller.accounts.get)
// router.get('/accounts/:id', controller.accounts.getById)
router.post('/accounts', controller.accounts.create)
// router.put('/accounts/:id', controller.accounts.update)
router.delete('/accounts/:id', controller.accounts.destroy)

module.exports = router