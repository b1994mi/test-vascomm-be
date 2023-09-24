const { ROLE_ADMIN } = require('../../../helper/const')

/**
 * @typedef {import("../../../helper/dependencyInjection")} DI
 * @param {DI} param0
 */
module.exports = ({ db, jwt }) => {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    return async (req, res) => {
        const refreshToken = req.headers?.refresh_token
        if (!refreshToken) {
            return res.status(400).json({
                code: res.statusCode,
                message: `refresh_token must be provided in header`
            })
        }

        let rt
        try {
            rt = await db.RefreshToken.findOne({
                where: { token: refreshToken },
                include: db.User,
            })
        } catch (error) {
            return res.status(422).json({
                code: res.statusCode,
                message: error.message
            })
        }

        if (!rt) {
            return res.status(403).json({
                code: res.statusCode,
                message: "refresh token is not valid"
            })
        }

        const token = jwt.sign({
            "user_id": rt.User.id,
            "role": rt.User.role,
        }, process.env.APP_SIGN, {
            expiresIn: process.env.APP_JWT_EXP
        })

        return res.status(200).json({
            code: res.statusCode,
            token,
        })
    }
}
