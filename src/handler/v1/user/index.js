const express = require('express')
const DI = require('../../../helper/dependencyInjection')
const createHandler = require('./create')

const router = express.Router()
router.post('/', createHandler(DI))

module.exports = router
