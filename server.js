const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { secret } = require('./config');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Rotas da API
const orderRoutes = require('./routes/orderRoutes');
app.use('/order', orderRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificação do usuário (exemplo básico)
        if (username === 'admin' && password === 'admin') {
            const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});