const bodyParser = require("body-parser")
const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors")

dotenv.config()

const { errNotFound, errInternalSvr } = require('./helper/error')
const handlerV1 = require('./handler/v1')
const db = require('./model')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/v1', handlerV1)
app.use(errNotFound)
app.use(errInternalSvr)

db.sequelize.authenticate().then(() => {
    console.log('success connect to db')
}).catch((error) => {
    console.log(`failed connect to db with message: ${error.message}`)
})

const port = process.env.APP_PORT
app.listen(port, () => {
    console.log(`Server running at server => ${port}`);
})
