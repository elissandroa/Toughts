const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('express-flash')
const FileStore = require('session-file-store')(session)

const port = 3000

const app = express()

const conn = require('./db/conn')


//Models
const Tought = require('./models/Tought')
const User = require('./models/User')


//Template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//Receber resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// Session midleware

app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)
// public path
app.use(express.static('public'))

//set session to res
app.use((req, res, next) => {
    if(req.session.userId){
        res.locals.session = req.session
    }
    next()
})

// Flash messages
app.use(flash())




conn.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Rodando na porta ${port}!`)
        })
    })
    .catch(((err) => console.log(err)))