const Sequelize = require('sequelize');
const db = require('../config/database');

const Item = db.define('item', {
    productId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.FLOAT
    }
});

module.exports = Item;
