const authRouter = require('express').Router()
const checkConfirmCode = require('../middlewares/checkConfirmCode')

const authController = require('../controllers/auth.controller')
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

module.exports = authRouter
