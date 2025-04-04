const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');

// Validação de cliente
function validateCliente(cliente) {
    const errors = [];
    
    if (!cliente.nome) {
        errors.push('Nome é obrigatório');
    }
    
    if (!cliente.email) {
        errors.push('Email é obrigatório');
    }
    
    if (!cliente.telefone) {
        errors.push('Telefone é obrigatório');
    }
    
    if (!cliente.status || !['ativo', 'inativo'].includes(cliente.status)) {
        errors.push('Status inválido');
    }
    
    return errors;
}

// Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .order('nome');
            
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({
            message: 'Erro ao listar clientes',
            error: error.message
        });
    }
});

// Buscar cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('id', req.params.id)
            .single();
            
        if (error) throw error;
        
        if (!data) {
            return res.status(404).json({
                message: 'Cliente não encontrado'
            });
        }
        
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({
            message: 'Erro ao buscar cliente',
            error: error.message
        });
    }
});

// Criar novo cliente
router.post('/', async (req, res) => {
    try {
        const cliente = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            status: req.body.status || 'ativo'
        };
        
        const errors = validateCliente(cliente);
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors
            });
        }
        
        // Verificar se já existe um cliente com o mesmo email
        const { data: existingCliente, error: checkError } = await supabase
            .from('clientes')
            .select('id')
            .eq('email', cliente.email)
            .single();
            
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }
        
        if (existingCliente) {
            return res.status(400).json({
                message: 'Cliente já existe',
                details: 'Já existe um cliente com este email'
            });
        }
        
        // Inserir novo cliente
        const { data, error } = await supabase
            .from('clientes')
            .insert([cliente])
            .select()
            .single();
            
        if (error) throw error;
        
        res.status(201).json(data);
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({
            message: 'Erro ao criar cliente',
            error: error.message
        });
    }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const cliente = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            status: req.body.status
        };
        
        const errors = validateCliente(cliente);
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors
            });
        }
        
        // Verificar se o cliente existe
        const { data: existingCliente, error: checkError } = await supabase
            .from('clientes')
            .select('id')
            .eq('id', req.params.id)
            .single();
            
        if (checkError) {
            if (checkError.code === 'PGRST116') {
                return res.status(404).json({
                    message: 'Cliente não encontrado'
                });
            }
            throw checkError;
        }
        
        // Verificar se já existe outro cliente com o mesmo email
        const { data: emailCheck, error: emailError } = await supabase
            .from('clientes')
            .select('id')
            .eq('email', cliente.email)
            .neq('id', req.params.id)
            .single();
            
        if (emailError && emailError.code !== 'PGRST116') {
            throw emailError;
        }
        
        if (emailCheck) {
            return res.status(400).json({
                message: 'Email já existe',
                details: 'Já existe outro cliente com este email'
            });
        }
        
        // Atualizar cliente
        const { data, error } = await supabase
            .from('clientes')
            .update(cliente)
            .eq('id', req.params.id)
            .select()
            .single();
            
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({
            message: 'Erro ao atualizar cliente',
            error: error.message
        });
    }
});

// Excluir cliente
router.delete('/:id', async (req, res) => {
    try {
        // Verificar se o cliente existe
        const { data: existingCliente, error: checkError } = await supabase
            .from('clientes')
            .select('id')
            .eq('id', req.params.id)
            .single();
            
        if (checkError) {
            if (checkError.code === 'PGRST116') {
                return res.status(404).json({
                    message: 'Cliente não encontrado'
                });
            }
            throw checkError;
        }
        
        // Excluir cliente
        const { error } = await supabase
            .from('clientes')
            .delete()
            .eq('id', req.params.id);
            
        if (error) throw error;
        
        res.json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(500).json({
            message: 'Erro ao excluir cliente',
            error: error.message
        });
    }
});

module.exports = router; 