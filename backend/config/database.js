const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('atm_app','root','', {
    host : 'localhost',
    dialect : 'mysql'
})

module.exports = sequelize;