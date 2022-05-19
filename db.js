// equire('dotenv').config()
const {Sequelize} = require('sequelize');
const keys = require('./config/keys')

module.exports = new Sequelize(
    keys.namedb,
    keys.userdb,
    keys.passdb,
    {
        dialect: 'mariadb',
        host: 'localhost',
        port: 3306,
        timezone: "Europe/Moscow"
    }

);


// module.exports = new Sequelize(
//     'server_upload_images',
//     'root',
//     'Ms159753',
//     {
//         dialect: 'mariadb',
//         host: 'localhost',
//         port: 3306,
//         timezone: "Europe/Moscow"
//     }
//
// );