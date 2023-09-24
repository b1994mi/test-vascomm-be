const express = require('express')
const userHandler = require('./user')

const router = express.Router()
router.use('/user', userHandler)

module.exports = router
