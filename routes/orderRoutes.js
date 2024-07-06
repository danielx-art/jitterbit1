const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { secret } = require('../config');
const Order = require('../models/Order');
const Item = require('../models/Item');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.post('/', authenticateJWT, async (req, res) => {
    try {
        const { orderId, value, creationDate, items } = req.body;

        const order = await Order.create({
            orderId,
            value,
            creationDate
        });

        await Promise.all(items.map(async (item) => {
            await Item.create({
                orderId: order.orderId,
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem
            });
        }));

        res.status(201).json({ message: 'Pedido criado com sucesso', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

router.get('/:orderId', authenticateJWT, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({
            where: { orderId },
            include: Item
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

router.get('/list', authenticateJWT, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: Item
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

router.put('/:orderId', authenticateJWT, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { value, creationDate, items } = req.body;

        const order = await Order.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        await order.update({ value, creationDate });

        // Atualiza os itens
        await Item.destroy({ where: { orderId } });
        await Promise.all(items.map(async (item) => {
            await Item.create({
                orderId,
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem
            });
        }));

        res.json({ message: 'Pedido atualizado com sucesso', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

router.delete('/:orderId', authenticateJWT, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        await Item.destroy({ where: { orderId } });
        await order.destroy();

        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

module.exports = router;
