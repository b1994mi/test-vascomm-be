const { Sequelize, DataTypes } = require('sequelize')
const pg = require('pg')

const sequelize = new Sequelize(process.env.PG_DSN, {
    define: { underscored: true },
    dialectModule: pg,
})

const db = {
    sequelize,
    Role: require('./Role')(sequelize, DataTypes),
    User: require('./User')(sequelize, DataTypes),
    RefreshToken: require('./RefreshToken')(sequelize, DataTypes),
}

Object.entries(db).forEach(([, m]) => {
    if (m.associate) {
        m.associate(db)
    }
})

module.exports = db
