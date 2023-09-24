/**
 * @typedef {import('../../../helper/dependencyInjection')} DI
 * @param {DI} param0
 */
module.exports = ({ db }) => {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    return async (req, res) => {
        return res.status(200).json({
            code: res.statusCode,
            message: "ok",
        })
    }
}
