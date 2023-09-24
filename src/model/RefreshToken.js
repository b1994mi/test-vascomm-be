/**
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define("RefreshToken", {
        userId: DataTypes.INTEGER,
        token: DataTypes.STRING,
        expiredAt: DataTypes.DATE
    }, {
        tableName: "refresh_tokens"
    })

    RefreshToken.associate = (m) => {
        RefreshToken.belongsTo(m.User)
    }

    return RefreshToken
}
