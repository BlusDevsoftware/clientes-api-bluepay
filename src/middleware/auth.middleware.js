const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabaseClient');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar se o usuário existe no Supabase
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', decoded.id)
            .single();

        if (error || !user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        if (user.status !== 'ativo') {
            return res.status(401).json({ message: 'Usuário inativo' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}; 