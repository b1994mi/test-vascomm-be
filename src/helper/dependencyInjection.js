const uuid = require('uuid')
const db = require('../model')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const DI = {
    uuid,
    db,
    bcrypt,
    jwt,
}

module.exports = DI
