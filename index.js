const express = require('express')
const app = express()
// Conexão com o banco
const Sequelize = require('sequelize')
const sequelize = new Sequelize('sistema2', 'root', 'Estacio@123', {
    host: 'localhost',
    dialect: 'mysql',
    query: {raw: true},
})

// Config template engine
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// bodyparser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Models
sequelize.authenticate().then(() => {
    console.log('Conectado ao banco com sucesso.')
}).catch((error) => {
    console.log('Falha ao se conectar: ', error)
})

const Postagem = sequelize.define('postagens', {
    titulo: {
        type: Sequelize.STRING,
    },
    conteudo: {
        type: Sequelize.TEXT,
    },
})

const Usuario = sequelize.define('usuarios', {
    nome: {
        type: Sequelize.STRING,
    },
    sobrenome: {
        type: Sequelize.STRING,
    },
    idade: {
        type: Sequelize.INTEGER,
    },
    email: {
        type: Sequelize.STRING,
    },
})

// Postagem.sync({force: true})
// Usuario.sync({force: true})

// Inserção

Usuario.create({
    nome: 'Gabriel',
    sobrenome: 'Eustaquio',
    idade: 21,
    email: 'gabriel@contato',
})

// Rotas

app.get('/', (req, res) => {
    res.render('formulario')
})

app.post('/add', (req, res) => {
    Postagem.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
    }).then(() => {
        res.redirect('/lista')
    }).catch((error) => {
        res.send('Erro ao criar post')
    })
})

app.get('/lista', (req, res) => {
    Postagem.findAll().then((posts) => {
        res.render('lista', {posts: posts})
    })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Servidor rodando')
})