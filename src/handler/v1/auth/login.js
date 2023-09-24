const { ROLE_ADMIN } = require('../../helper/const')

/**
 * @typedef {import("../../helper/depInject")} DI
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
                where: { email },//or phone
            })
        } catch (error) {
            return res.status(422).json({ code: res.statusCode, error: error.message })
        }

        if (!user || !user?.isVerified) {
            return res.status(403).json({
                code: res.statusCode,
                error: `user with email ${email} was not found or is not verified yet`
            })
        }

        let roles = [], permissions = [], isAdmin = false
        user?.Roles?.forEach(e => {
            isAdmin = isAdmin || e?.obfuscatedCode === ROLE_ADMIN
            roles.push(e?.obfuscatedCode)

            e?.Permissions?.forEach(el => {
                permissions.push(el?.id)
            })
        })

        const isCorrectPass = await bcrypt.compare(password, user?.password)
        if (!isCorrectPass) {
            return res.status(403).json({
                code: res.statusCode,
                error: `password for ${email} is not correct`
            })
        }

        const expiredAt = new Date()
        expiredAt.setHours(
            expiredAt.getHours() + parseInt(process.env.REFRESH_TOKEN_EXP)
        )

        let refreshToken
        try {
            refreshToken = await db.RefreshToken.create({
                userId: user.id,
                token: uuid.v4(),
                expiredAt,
            })
        } catch (error) {
            return res.status(422).json({ code: res.statusCode, error: error.message })
        }

        const token = jwt.sign({
            "user_id": user.id,
            "username": user.username,
            "is_admin": isAdmin,
            "role": roles,
            "permission": permissions,
        }, process.env.SALT_APP, {
            expiresIn: process.env.TOKEN_EXP
        })

        return res.status(200).json({ code: res.statusCode, token, refresh_token: refreshToken.token })
    }
}
