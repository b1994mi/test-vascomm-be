const { Op } = require("sequelize")

/**
 * @typedef {import("../../../helper/dependencyInjection")} DI
 * @param {DI} param0
 */
module.exports = ({ db, bcrypt, jwt, uuid }) => {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    return async (req, res) => {
        const {
            email,
            phone_number: phoneNumber,
            password
        } = req.body

        if (!email && !phoneNumber) {
            return res.status(400).json({
                code: res.statusCode,
                message: 'email or phone number must be provided'
            })
        }

        if (!password) {
            return res.status(400).json({
                code: res.statusCode,
                message: 'password must be provided'
            })
        }

        let user
        try {
            user = await db.User.unscoped().findOne({
                where: {
                    [Op.or]: [{ email }, { phoneNumber }],
                },
                include: db.Role,
            })
        } catch (error) {
            return res.status(422).json({
                code: res.statusCode,
                message: error.message
            })
        }

        if (!user || !user?.isVerified) {
            return res.status(403).json({
                code: res.statusCode,
                message: `user with email ${email} was not found or is not verified yet`
            })
        }

        const isCorrectPass = await bcrypt.compare(password, user?.password)
        if (!isCorrectPass) {
            return res.status(403).json({
                code: res.statusCode,
                message: `password for ${email} is not correct`
            })
        }

        const expiredAt = new Date()
        expiredAt.setHours(
            expiredAt.getHours() + parseInt(process.env.APP_REFRESH_TOKEN_EXP)
        )

        let refreshToken
        try {
            refreshToken = await db.RefreshToken.create({
                userId: user.id,
                token: uuid.v4(),
                expiredAt,
            })
        } catch (error) {
            return res.status(422).json({
                code: res.statusCode,
                message: error.message
            })
        }

        const token = jwt.sign({
            "user_id": user.id,
            "role": user.role,
        }, process.env.APP_SIGN, {
            expiresIn: process.env.APP_JWT_EXP
        })

        return res.status(200).json({
            code: res.statusCode,
            refresh_token: refreshToken.token,
            token,
        })
    }
}
