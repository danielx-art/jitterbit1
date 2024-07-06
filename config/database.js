const Sequelize = require('sequelize');
const { database } = require('./config');

const sequelize = new Sequelize(database.name, database.username, database.password, {
    host: database.host,
    dialect: database.dialect
});

const Order = require('../models/Order');
const Item = require('../models/Item');

Item.belongsTo(Order);
Order.hasMany(Item);   // Um pedido pode ter vários itens

module.exports = sequelize;
