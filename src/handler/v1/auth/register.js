const bcrypt = require("bcrypt")
const { Op } = require("sequelize")
const {
    USERNAME_REGEX,
    PHONE_REGEX,
    PASS_REGEX,
    EMAIL_REGEX,
    OTL_VERIFY_REGISTRATION,
    EMAIL_TMPL_VERIFY_REGIST,
    ROLE_USER_ID
} = require('../../helper/const')

/**
 * @typedef {import("../../helper/depInject")} DI
 * @param {DI} param0
 */
module.exports = ({ db, smtp, superAdminSvc }) => {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    return async (req, res) => {
        const {
            username,
            email,
            password,
            firstname = 'pls change',
            lastname = 'pls change',
            position = 'pls change',
            phone_number: phoneNumber = '+628',
        } = req.body

        const mandatoryBody = {
            username,
            email,
            password,
        }

        let incomplete = []
        Object.entries(mandatoryBody).forEach(([k, v]) => {
            if (!v) {
                incomplete.push(k)
            }
        })

        if (incomplete?.length > 0) {
            return res.status(400).json({
                code: res.statusCode,
                error: `${incomplete.join(', ')} must be present`
            })
        }

        if (!username.match(USERNAME_REGEX)?.length) {
            return res.status(400).json({
                code: res.statusCode,
                error: 'username must only contains alphanumeric or underscore or dash'
            })
        }

        if (!password.match(PASS_REGEX)?.length) {
            return res.status(400).json({
                code: res.statusCode,
                error: 'password length must be 8 or more and contains aphanumeric and special char'
            })
        }

        if (!email.toLowerCase().match(EMAIL_REGEX)?.length) {
            return res.status(400).json({
                code: res.statusCode,
                error: 'must use a valid email'
            })
        }

        if (!phoneNumber.match(PHONE_REGEX)?.length) {
            return res.status(400).json({
                code: res.statusCode,
                error: "only allows number or number with '+' in front"
            })
        }

        try {
            const user = await db.User.findOne({
                where: { [Op.or]: [{ username }, { email }] }
            })

            if (user) {
                return res.status(409).json({
                    code: res.statusCode,
                    error: "username or email has been used"
                })
            }

            const result = await (await superAdminSvc.checkCanAddUser()).json()
            if (!result.allowed) {
                return res.status(409).json({
                    code: res.statusCode,
                    error: "you have reached user limit, please contact your admin to subscribe to more user limit"
                })
            }
        } catch (error) {
            return res.status(422).json({ code: res.statusCode, error: error.message })
        }

        let linkUnique = ""
        const tx = await db.sequelize.transaction()
        try {
            const user = await db.User.create({
                username,
                email,
                password: bcrypt.hashSync(password, 10),
                isVerified: false,
            }, { transaction: tx })

            await db.UserProfile.create({
                userId: user.id,
                firstname,
                lastname,
                position,
                phoneNumber,
            }, {
                transaction: tx,
                returning: false,
            })

            linkUnique = bcrypt.hashSync(`${user.id}${process.env.SALT_APP}`, 10)
            linkUnique = encodeURIComponent(linkUnique)

            const expiredAt = new Date();
            expiredAt.setHours(
                expiredAt.getHours() + parseInt(process.env.OTL_VERIFY_REGIST_EXP)
            )

            await db.OneTimeLink.create({
                userId: user.id,
                linkUnique,
                linkType: OTL_VERIFY_REGISTRATION,
                isUsed: false,
                expiredAt,
            }, {
                transaction: tx,
                returning: false,
            })

            // newly created user will have 'user' role
            await db.UserHasRole.create({ userId: user.id, roleId: ROLE_USER_ID }, {
                // For some reason if I don't provide this fields option
                // the generated query will insert null value to posgres.
                // So, `fileds` is important to generate correct query.
                fields: ['userId', 'roleId'],
                transaction: tx,
                returning: false,
            })

            let result = await superAdminSvc.addUser()
            if (!result.ok) {
                result = await result.json()
                throw new Error(`error add user: ${result.message}`)
            }

            tx.commit()
        } catch (error) {
            tx.rollback()
            return res.status(422).json({ code: res.statusCode, error: error.message })
        }

        // send email async because I doubt this Outlook SMTP is reliable
        smtp.sendMail({
            to: email,
            subject: "Email Verification",
            text: "Please verify your email to use ESRI ID Multitenant App",
            html: EMAIL_TMPL_VERIFY_REGIST(`http://www.esri.com/multitenant/${linkUnique}`),
        }).then((r) => {
            console.log(r)
        }).catch((r) => {
            console.log(r)
        })

        return res.status(200).json({ code: res.statusCode, "acknowledge": "true" })
    }
}
