const { Op } = require('sequelize')
const { ROLE_USER_ID } = require('../../../helper/const')

/**
 * @typedef {import('../../../helper/dependencyInjection')} DI
 * @param {DI} param0
 */
module.exports = ({ db, bcrypt, uuid }) => {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    return async (req, res) => {
        const {
            email,
            phone_number: phoneNumber,
        } = req.body

        if (!email || !phoneNumber) {
            return res.status(400).json({
                code: res.statusCode,
                message: 'email and phone number must be provided'
            })
        }

        try {
            const user = await db.User.findOne({
                where: {
                    [Op.or]: [{ phoneNumber }, { email }]
                }
            })

            if (user) {
                return res.status(409).json({
                    code: res.statusCode,
                    message: 'phone number or email has been used'
                })
            }
        } catch (error) {
            return res.status(422).json({
                code: res.statusCode,
                message: error.message
            })
        }

        const password = uuid.v4()
        try {
            await db.User.create({
                roleId: ROLE_USER_ID,
                email,
                phoneNumber,
                password: bcrypt.hashSync(password, 10),
                isVerified: false,
            }, {
                returning: false
            })
        } catch (error) {
            return res.status(422).json({
                code: res.statusCode,
                message: error.message
            })
        }

        return res.status(200).json({
            code: res.statusCode,
            message: 'user is created',
            password, // TODO: send to email, not res body
        })
    }
}
