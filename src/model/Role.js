/**
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
    }, {
        tableName: "roles",
    })

    return Role
}
