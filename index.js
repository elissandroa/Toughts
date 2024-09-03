const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('express-flash')
const fileStore = require('session-file-store')(session)

const port = 3000

const app = express()

const conn = require('./db/conn')



conn.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`Rodando na porta ${port}!`)
    })
})
.catch(((err) => console.log(err)))