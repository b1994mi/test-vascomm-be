const { ROLE_ADMIN } = require('../../helper/const')

/**
 * @typedef {import("../../helper/depInject")} DI
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
                error: `refresh_token must be provided in header`
            })
        }

        const incluedRole = {
            model: db.Role,
            attributes: ['id', 'name', 'obfuscatedCode'],
            // using empty array will cause not to return the relation fields
            through: { attributes: [] },
            include: [{
                model: db.Permission,
                attributes: ['id', 'name'],
                // using empty array will cause not to return the relation fields
                through: { attributes: [] }
            }]
        }

        const includeRefreshToken = {
            model: db.RefreshToken,
            attributes: ['id', 'token', 'expiredAt'],
            where: { token: refreshToken }
        }

        let user
        try {
            user = await db.User.findOne({
                include: [incluedRole, includeRefreshToken]
            })
        } catch (error) {
            return res.status(422).json({
                code: res.statusCode,
                error: error.message
            })
        }

        if (!user) {
            return res.status(403).json({
                code: res.statusCode,
                error: "refresh token is not valid"
            })
        }

        const now = new Date()
        const rt = user?.RefreshTokens
        for (let i = 0; i < rt?.length; i++) {
            const e = rt[i]
            const hasExpired = e?.expiredAt?.getTime() < now.getTime()
            if (!hasExpired) {
                continue
            }

            db.RefreshToken.destroy({
                where: { id: e?.id }
            })

            return res.status(403).json({
                code: res.statusCode,
                error: "refresh token is invalid"
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

        const token = jwt.sign({
            "user_id": user.id,
            "username": user.username,
            "is_admin": isAdmin,
            "role": roles,
            "permission": permissions,
        }, process.env.SALT_APP, {
            expiresIn: process.env.TOKEN_EXP
        })

        return res.status(200).json({ code: res.statusCode, token })
    }
}
