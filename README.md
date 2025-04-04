# API de Clientes - BluePay

API para gerenciamento de clientes do sistema BluePay.

## Requisitos

- Node.js 14.x ou superior
- npm ou yarn
- Conta no Supabase

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure as variáveis de ambiente no arquivo `.env`:
```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase
JWT_SECRET=seu_segredo_jwt
PORT=3001
```

## Executando a API

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## Endpoints

### Clientes

- `GET /api/clientes` - Lista todos os clientes
- `GET /api/clientes/:id` - Busca um cliente por ID
- `POST /api/clientes` - Cria um novo cliente
- `PUT /api/clientes/:id` - Atualiza um cliente
- `DELETE /api/clientes/:id` - Exclui um cliente

## Autenticação

Todas as rotas requerem autenticação via token JWT. O token deve ser enviado no header `Authorization` no formato:
```
Authorization: Bearer seu_token_jwt
```

## Estrutura do Projeto

```
src/
  ├── config/
  │   └── supabaseClient.js
  ├── middleware/
  │   └── auth.middleware.js
  ├── routes/
  │   └── clientes.routes.js
  └── index.js
``` 