/**
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        roleId: DataTypes.INTEGER,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        isVerified: DataTypes.BOOLEAN,
    }, {
        tableName: "users",
        paranoid: true,
        defaultScope: {
            attributes: {
                exclude: ['password']
            }
        }
    })

    /** @param {import("./index")} m */
    User.associate = (m) => {
        User.belongsTo(m.Role)
    }

    return User
}
