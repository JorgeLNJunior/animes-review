<div align="center" id="short-description">

<img src="https://i.ibb.co/q045V4Z/AR-Logo.png" width="300px">

<h1>Animes Review</h1>

Plataforma para avaliação de animes

</div>

<div align="center" id="badges">

[![License](https://img.shields.io/github/license/JorgeLNJunior/animes-review)](https://github.com/JorgeLNJunior/animes-review/blob/master/LICENSE.md)
[![Release](https://img.shields.io/github/v/release/JorgeLNJunior/animes-review?color=lgreen)](https://github.com/JorgeLNJunior/animes-review/releases)

</div>

<div align="center">

[Trello](https://trello.com/b/o7iD52J4/animes-review) |
[Back-end](https://github.com/JorgeLNJunior/animes-review-api)

</div>

## Tabela de Conteúdos
* [Rotas](https://github.com/JorgeLNJunior/animes-review#rotas)
* [Tecnologias](https://github.com/JorgeLNJunior/animes-review#tecnologias)
* [Instalação e configuração](https://github.com/JorgeLNJunior/animes-review#instala%C3%A7%C3%A3o-e-configura%C3%A7%C3%A3o)
  * [Requisitos](https://github.com/JorgeLNJunior/animes-review#requisitos)
  * [Opcional](https://github.com/JorgeLNJunior/animes-review#requisitos)
  * [Instalação](https://github.com/JorgeLNJunior/animes-review#instala%C3%A7%C3%A3o)
* [Licença](https://github.com/JorgeLNJunior/animes-review#licen%C3%A7a)

## Rotas

Informações básicas sobre as rotas da aplicação.
| HTTP   | Rota                  | Descrição                           | Autenticação |
|--------|-----------------------|-------------------------------------|--------------|
| GET    | /register             | registra um usuário                 | não          |
| GET    | /login                | autentica um usuário                | não          |
| GET    | /home                 | página principal                    | sim          |
| GET    | /animes               | mostra alguns animes                | sim          |
| GET    | /animes/:uuid         | mostra um anime e alguns reviews    | sim          |
| GET    | /animes/:uuid/review  | avalia um anime                     | sim          |
| GET    | /admin/home           | página principal para administrador | sim          |
| GET    | /admin/animes         | criação e edição de animes          | sim          |
| GET    | /users/:uuid          | mostra um usuário                   | sim          |
| GET    | /users/:uuid/config   | configurações do usuário            | sim          |
| GET    | /reviews/:uuid/update | atualiza um review                  | sim          |

**A fazer**

## Tecnologias
Este projeto foi construído com as seguintes tecnologias:
- [Node.js »](https://nodejs.org)
- [Vue.js 3 »](https://v3.vuejs.org/)
- [Typescript »](https://www.typescriptlang.org)
- [Bulma CSS »](https://www.bulma.io)

## Instalação e configuração
### Requisitos
  - [Node.js »](https://nodejs.org/en/download) na sua versão lts
  - O [Back End »](https://github.com/JorgeLNJunior/animes-review-api) da aplicação

### Instalação e inicialização
  1. Clone o projeto: `git clone https://github.com/JorgeLNJunior/animes-review.git`
  2. Instale as dependências: `npm i`
  3. Renomeie o arquivo `.env.example` para `.env`
  4. Para iniciar a aplicação execute `npm run dev`

## Licença
Projeto sob a licença [MIT »](https://github.com/JorgeLNJunior/animes-review/blob/master/LICENSE.md)
