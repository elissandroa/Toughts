const User = require("../models/User")
const bcrypt = require('bcryptjs')
const flash = require('express-flash')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {

        const { email, password } = req.body

        //find User
        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            req.flash('message', 'O Email já está em uso!')
            res.render('auth/login')
            return
        }


        //check if passwords match
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')
            return
        }

        //Initialize Session
        req.session.userId = user.id

        req.flash('message', 'Autenticação realizado com sucesso!')

        req.session.save(() => {

            res.redirect('/')
        })
    }


    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmPassword } = req.body
        //Password math validation
        if (password != confirmPassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')
        }

        //Check if User exists
        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash('message', 'O Email já está em uso!')
            res.render('auth/register')
            return
        }

        //Create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            const createdUser = await User.create(user)
            //Initialize Session
            req.session.userId = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(() => {

                res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }


}