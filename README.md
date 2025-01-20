# Plataforma de Pensamentos

Este projeto é uma plataforma de pensamentos que permite aos usuários cadastrados criar, visualizar, editar e excluir pensamentos (CRUD). Além disso, os usuários podem explorar os pensamentos criados por outros usuários. Para garantir segurança, a plataforma implementa autenticação e controle de acesso, ocultando páginas de usuários não autorizados.

## Tecnologias Utilizadas

### Frontend
- **Vue.js**: Framework progressivo para construção da interface do usuário.
- **Vuetify**: Biblioteca de componentes estilizados baseada em Material Design.
- **Axios**: Biblioteca para fazer requisições HTTP.
- **Pinia**: Gerenciamento de estado no Vue.js.

### Backend
- **Node.js**: Ambiente de execução JavaScript para backend.
- **Express.js**: Framework minimalista para criação de APIs.
- **Bcrypt**: Biblioteca para hashing de senhas.
- **CORS**: Middleware para lidar com políticas de compartilhamento de recursos entre diferentes origens.
- **Jsonwebtoken (JWT)**: Implementação de autenticação baseada em tokens.
- **Mongoose**: ORM para modelar e interagir com o banco de dados MongoDB.

## Arquitetura

O projeto segue a arquitetura **MVC (Model-View-Controller)**, separando responsabilidades para garantir uma melhor organização e manutenção do código:
- **Model**: Responsável pela definição das entidades e regras de negócios.
- **View**: Camada de interface do usuário, construída com Vue.js e Vuetify.
- **Controller**: Lógica responsável por intermediar o modelo e a visualização, gerenciando as requisições da API.

## Funcionalidades

### Usuários
- Cadastro de novos usuários com hashing de senha.
- Login com geração de token JWT para autenticação.
- Controle de sessão para proteger páginas restritas.

### Pensamentos
- Criação de novos pensamentos.
- Visualização de pensamentos próprios e de outros usuários.
- Edição e exclusão de pensamentos (apenas pelo criador).

## Estrutura da API

O backend foi desenvolvido como uma API RESTful, possibilitando integração com o frontend. Principais rotas:

### Usuários
- `POST users/register`: Cadastro de usuário.
- `POST users/login`: Login e geração de token JWT.
- `GET /api/users/checkuser`: Verifica se o usuário está autenticado utilizando o token.

### Pensamentos
- `GET /toughts`: Listar pensamentos.
- `GET /toughts/mytoughts`: Listar meus pensamentos.
- `POST /toughts/add`: Criar novo pensamento.
- `PATCH /toughts/:id`: Editar pensamento existente.
- `DELETE /toughts/:id`: Excluir pensamento.
- `PATCH /:id/like: Alterna entre adicionar e remover curtidas.
- `PATCH /:id/commen: Alterna entre adicionar e remover comentários.
- `GET /:id/comment: Retorna a lista de comentários.

## Segurança

- Hashing de senhas com **Bcrypt**.
- Autenticação com **JWT** para proteger rotas.
- Políticas de CORS configuradas para restringir acessos não autorizados.

## Pré-requisitos

- Node.js e npm instalados.
- MongoDB configurado e em execução.

## Como Executar

### Backend
1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env` (exemplo disponível em `.env.example`).
4. Inicie o servidor:
   ```bash
   npm start
   ```

### Frontend
1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.
