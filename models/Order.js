// models/Order.js

const Sequelize = require('sequelize');
const db = require('../config/database');

const Order = db.define('order', {
    orderId: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    value: {
        type: Sequelize.FLOAT
    },
    creationDate: {
        type: Sequelize.DATE
    }
});

module.exports = Order;
