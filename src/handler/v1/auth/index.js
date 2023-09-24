const { Router } = require('express')
const DI = require('../../../helper/dependencyInjection')

const loginHandler = require('./login')
const registerHandler = require('./register')
const refreshTokenHandler = require('./refreshToken')

const router = Router()
router.post('/login', loginHandler(DI))
router.post('/register', registerHandler(DI))
router.post('/refresh-token', refreshTokenHandler(DI))

module.exports = router
