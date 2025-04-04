require('dotenv').config();
const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientes.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de autenticação para todas as rotas
app.use(authMiddleware);

// Rotas
app.use('/api/clientes', clientesRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API de Clientes do BluePay está funcionando!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 