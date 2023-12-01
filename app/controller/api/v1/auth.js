const { PrismaClient } = require('@prisma/client')
const ejs = require('ejs')
const { encryptPassword, checkPassword } = 
    require('../../../../utils/auth')
const { JWTsign } = 
    require('../../../../utils/jwt')
const { sendMail, sendMailHTML } = require('../../../../utils/mailer')
const jwt = require('jsonwebtoken')
let { JWT_SECRET_KEY } = process.env;

const prisma = new PrismaClient();

module.exports = {
    async login(req, res){
        const {email, password} = req.body;
        const user = await prisma.customer.findFirst({
            where: { email }
        })
        if(!user){
            return res.status(404).json({
                status: "Fail!",
                message: "User tidak ditemukan!"
            })
        }
        const isPasswordCorrect = await checkPassword(
            password, user.password
        )
        if(!isPasswordCorrect){
            return res.status(401).json({
                status: "Fail!",
                message: "Password Salah!"
            })
        }
        delete user.password
        const token = await JWTsign(user)
        return res.status(201).json({
            status: "Success!",
            message: "Berhasil Login!",
            data: { user, token } 
        })
    },
    async whoami(req, res){
        return res.status(200).json({
            status: "Success!",
            message: "OK",
            data: {
                user: req.user
            }
        })
    },
    async register(req, res){
        const {email, password, nama, alamat} = req.body;
        const user = await prisma.customer.findFirst({
            where: { email }
        })

        if(user){
            return res.status(404).json({
                status: "Fail!",
                message: "Email sudah terdaftar!"
            })
        }

        const createUser = await prisma.customer.create({
            data: {
                email,
                nama,
                password: await encryptPassword(password),
                alamat
            }
        });

        req.io.emit('notification', 'Hi, this is a welcome notification! You have successfully registered');
        return res.status(201).json({ 
            status: 'success', 
            code: 200, 
            message: 'Berhasil Register',
            data: createUser
        })
    },
    registerForm: async (req, res, next) => {
        try{
            const {email, password, nama, alamat} = req.body;
            console.log(req.body);
            const user = await prisma.customer.findFirst({
                where: { email }
            })

            if(user){
                req.flash("error", "Email sudah terdaftar!")
                return res.redirect('/register')
            }

            const createUser = await prisma.customer.create({
                data: {
                    email,
                    nama,
                    password: await encryptPassword(password),
                    alamat
                }
            });

            req.flash("success", "Berhasil Register!")
            return res.redirect('/login')
        }catch(e){
            next(e) // untuk mengirim error ke middleware dan ditampilkan di ejs
        }
    },
    authUser: async (email, password, done) => {
        try{
            const user = await prisma.customer.findUnique({
                where: {email}
            })

            if(!user || !await checkPassword(password, user.password)){
                return done(null, false, {message: 'Invalid email or password'})
            }

            return done(null, user)
        } catch (err) {
            return done(null, false, {message: err.message})
        }
    },
    // dashboard: async (req, res) => {
    //     res.render('dashboard.ejs'), {user: req.user}
    // },
    // oauth: async (req, res) => {
    //     const token = await JWTsign({ 
    //         ...req.user, 
    //         password: null
    //     })
    //     return res.json({
    //         status: "Success!",
    //         message: "Berhasil Login!",
    //         data: { token }
    //     })
    // }
    async forgetPassword(req, res){
        const { email } = req.body;
        const user = await prisma.customer.findFirst({
            where: { email }
        })

        if(!user){
            return res.status(404).json({
                status: "Failed!",
                message: "User tidak ditemukan!"
            })
        }

        const url = `${req.protocol}://${req.headers.host}`
        const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY , { expiresIn: '15m' })

        ejs.renderFile(__dirname + "../../../view/templates/register.ejs", 
        { 
            url: `http://localhost:3000/resetPassword/${token}` 
        }, 
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                sendMailHTML(email, `Reset Password`, data)
            }
        })

        res.status(200).json({
            status: 'Success!',
            message: 'Berhasil mengirim email reset password',
            url: url
        })
    },
    async resetPassword(req, res){
        try {
            const { token } = req.params
            const { password, confirmPassword } = req.body
            
            if(password !== confirmPassword){
                return res.status(400).json({
                    status: 'failed',
                    message: 'New Password and Confirm Password are not match!'
                })
            }

            const user = jwt.verify(token, JWT_SECRET_KEY)
    
            const updatedUser = prisma.customer.update({
                where: { email: user.email },
                data: { 
                    password: await encryptPassword(password) 
                }
            })

            req.io.emit('notification', 'Hi, this is a notification! Your password has been reset');
            return res.status(200).json({
                status: 'success',
                message: 'Password berhasil di-reset!',
                data: updatedUser
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Terjadi kesalahan server.' })
        }
    }
} 