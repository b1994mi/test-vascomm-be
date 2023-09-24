const express = require('express')
const authHandler = require('./auth')
const userHandler = require('./user')

const router = express.Router()
router.use('/auth', authHandler)
router.use('/user', userHandler)

module.exports = router
