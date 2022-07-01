const authRouter = require('express').Router()
const checkConfirmCode = require('../middlewares/checkConfirmCode')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const Users = require('../models/Users')
const authController = require('../controllers/auth.controller')
const bcrypt = require('bcrypt')

const {
  validationErrorHandler,
  isPasswordEmpty,
} = require('../middlewares/userInfoValidation')
const {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} = require('../middlewares/userInfoValidation')

// Register
authRouter.post(
  '/register',
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler,
  authController.register
)

// Login with email
authRouter.post(
  '/login',
  isPasswordEmpty,
  validationErrorHandler,
  authController.loginWithEmail
)

// Google login
authRouter.post('/googleLogin', authController.loginWithGoogle)

//forgot password
authRouter.post('/forgot_password', authController.getEmailToResetPassword)

//verification
authRouter.post('/verification', authController.verificationCode)

// Send code and reset password
authRouter.patch(
  '/reset_password',
  checkConfirmCode,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler,
  authController.resetPassword
)

authRouter.post(
  '/verify_email',
  validateEmail,
  validationErrorHandler,
  checkConfirmCode,
  authController.emailVerification
)

//give products
authRouter.post('/get_products', authController.getProducts)

//contact us message
authRouter.post(
  '/send_message',
  validateEmail,
  validateFirstName,
  validationErrorHandler,
  authController.sendMessage
)

//search function
authRouter.get('/search', authController.search)

authRouter.post('/loginUser', function (req, res, next) {
  console.log('req', req.body)
  passport.authenticate('local', (error, user, info) => {
    console.log('user', user)

    if (!user) {
      res.send({ error: 'user invalid' })
      console.log('verify che')
    } else if (user?.isEmailVerified === true) {
      console.log('verify e ')
      req.logIn(user, (err) => {
        if (err) {
          res.send({ error: 'invalid' })
        } else {
          console.log('userr', user)
          res.send({
            status: 'ok',
            data: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            },
          })
        }
      })
    } else {
      data: res.send({ error: 'please verify email' })
    }
  })(req, res, next)
})

passport.use(
  'local',
  new LocalStrategy(async function (username, password, done) {
    console.log('username', username)
    const email = username
    const us = await Users.findOne({ email })
    console.log('local,', us)
    if (us) {
      console.log('109', us)
      if (bcrypt.compareSync(password, us.password)) {
        console.log('passwordy havasar e ')
        return done(null, us)
      } else {
        return done(null, false)
      }
    } else {
      return done(null, false)
    }
  })
)

passport.serializeUser(function (user, done) {
  console.log('ser', user)
  console.log('serializeUser')
  console.log('id', user._id)
  done(null, user._id)
})

passport.deserializeUser(async function (id, done) {
  const _id = id
  console.log(_id)
  const us = await Users.findOne({ _id })
  console.log('deser', us)

  done(null, us)
})

module.exports = authRouter
