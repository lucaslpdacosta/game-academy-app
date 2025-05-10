# Game Academy

O Game Academy é um projeto pessoal, feito para ser um aplicativo de aprendizado com gamificação. A aplicação permite que usuários cadastrem-se possam acessar conteúdos e realizar testes educativos com toques de elementos de jogos.

## ℹ️ Funcionalidades Principais

- Cadastro e autenticação de usuários com tokens JWT (auth token e refresh token):
  - O usuário previamente autenticado não precisa entrar com suas informações novamente no formulário de login.
  - O usuário pode recuperar a senha de sua conta, informando seu e-mail de cadastro e inserindo o código enviado ao e-mail.
- User roles:
  - **Admin**: Tem direito exclusivo de criar módulos, conteúdos e testes.
  - **Usuário comum**: Pode acessar os módulos, conteúdos e testes, além de customizar seu perfil.
- Gerenciamento de aplicação:
  - Controle de efeitos sonoros com estados e hooks do React.
  - Gerenciamento de conta: deslogar ou deletar conta.
- Acompanhamento de metas:
  - O usuário pode acompanhar quantos pontos (estrelas) reuniu de um módulo e seu progresso individual.

## 🚀 Tecnologias Principais

### Front-end:
- React Native
- Expo
- React Navigation
- Axios
- React Native Paper

### Back-end:
- Node.js + Express
- PostgreSQL + Sequelize
- Gerenciamento de tokens JWT (Auth token, Refresh token)
- Middlewares específicos

## 📌 Arquitetura
O projeto segue o padrão **MVC** (Model-View-Controller) para organização do código.

## ↔️ Diagrama Entidade-Relacionamento
![Image](https://github.com/user-attachments/assets/4393ec31-8356-4952-b67b-72c956e749bb)

## ▶️ Como Rodar o Projeto:

- Criar o banco de dados **gameacademy** no PostgreSQL
- Usar a ferramenta como **Ngrok** para rodar a aplicação localmente com o Expo
- Aplicar o seguinte comando para configurar o tunelamento da porta do servidor com o Ngrok:
```
ngrok http 3000
```
- Alterar a URL de conexão para a informada pelo ngrok em todas as ocorrências do projeto.

### Configuração do .env
Crie um arquivo .env na raiz do diretório "Api" e defina as seguintes variáveis. Substitua "******" por valores reais:

```
PORT=******
SECRET_KEY=******
REFRESH_SECRET_KEY=****** 
DB_DATABASE=gameacademy
DB_USERNAME=******
DB_PASSWORD=****** 
```

### Executando o Back-end
```sh
npm install
node index.js
```

### Executando o Front-end
```sh
npm install
npx expo start
```

## 🛠️ Endpoints Principais

### Autenticação
- **POST /cadastro** - Cadastra novos usuários
- **POST /login** - Autentica usuário e retorna token
- **POST /refresh** - Renova token de acesso
- **PUT /redefinir-senha** - Altera senha após confirmação de e-mail

### Usuário
- **DELETE /usuarios/:id** - Remove um usuário
- **GET /perfil** - Lista dados do perfil do usuário atual
- **GET /avatar** - Busca ID do avatar
- **PUT /update-avatar** - Atualiza avatar
- **GET /capa** - Busca ID da capa
- **PUT /update-capa** - Atualiza capa

### Módulos e Conteúdos
- **POST /modulos** - Adiciona um novo módulo
- **GET /modulos** - Retorna todos os módulos
- **GET /modulos/:id** - Retorna módulo por ID
- **DELETE /modulos/:id** - Remove um módulo
- **POST /conteudos** - Adiciona novo conteúdo
- **GET /conteudos/modulo/:moduloId** - Retorna conteúdos de um módulo

### Testes
- **POST /testes/:moduloId/:conteudoId** - Adiciona um novo teste
- **GET /testes/:id** - Retorna teste por ID

### Pontuação
- **GET /pontuacoes/usuario/:UsuarioId** - Retorna pontuação total do usuário
- **GET /pontuacoes/:UsuarioId/:ModuloId/:ConteudoId** - Retorna pontuação específica
- **POST /pontuacoes/:UsuarioId/:ModuloId/:ConteudoId** - Adiciona pontuação

## 📷 Telas da Aplicação:

![Image](https://github.com/user-attachments/assets/0385f8b7-241a-461b-8e29-b82cde9268dc)

![Image](https://github.com/user-attachments/assets/dadcbba6-0329-4c17-846a-e12c21b850a9)

![Image](https://github.com/user-attachments/assets/6f51a495-a6ba-4301-ab96-0fe7e99d6cba)

![Image](https://github.com/user-attachments/assets/6ffba46d-1bf1-4c50-9e58-ce9e823c42d1)

![Image](https://github.com/user-attachments/assets/08774a61-2d41-4eec-9e72-0ea3a74d3737)

![Image](https://github.com/user-attachments/assets/75641528-a0c6-4ef0-8e49-eae596637ce3)
