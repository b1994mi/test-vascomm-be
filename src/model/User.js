/**
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        isVerified: DataTypes.BOOLEAN,
    }, {
        tableName: "users",
        defaultScope: {
            attributes: {
                exclude: ['password']
            }
        }
    })

    return User
}
