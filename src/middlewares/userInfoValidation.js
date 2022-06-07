const { body, validationResult } = require('express-validator')

const validateFirstName = body('firstName')
  .not()
  .isEmpty()
  .withMessage('First name is required field.')
  .isLength({ min: 2, max: 30 })
  .withMessage('First name must contain from 2 to 30 symbols')
  .matches(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
  .withMessage('First name filed must be only one space and only letters.')

const validateLastName = body('lastName')
  .not()
  .isEmpty()
  .withMessage('Last name is required field.')
  .isLength({ min: 2, max: 30 })
  .withMessage('Last name must contain from 2 to 30 symbols')
  .matches(/^[a-zA-z]+(\s||-)([a-zA-Z]+)*$/)
  .withMessage('Last name must be only letters and one line.')

const validateEmail = body('email')
  .not()
  .isEmpty()
  .withMessage('Email is required field.')
  .isEmail()
  .withMessage('Invalid email format.')

const validatePassword = body('password')
  .not()
  .isEmpty()
  .withMessage('Password is required field.')
  .custom((value) => !/\s/.test(value))
  .withMessage('No spaces are allowed in the password.')
  .isLength({ min: 8, max: 20 })
  .withMessage('Password must contain from 8 to 20 symbols')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?=+-,.])([A-Za-z\d#$@!%&*?=+-,.]){8,30}$/
  )
  .withMessage(
    'Password must contain minimum one capital letter, minimum one small letter, minimum one number and minimum one special symbol like [#$@!%&*?=+-].'
  )

const isPasswordEmpty = body('password') // check [password] filed empty or not
  .not()
  .isEmpty()
  .withMessage('Password filed cannot be left blank.')

const validatePasswordConfirm = body('passwordConfirm').custom(
  (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match with password.')
    }
    return true
  }
)

function validationErrorHandler(req, res, next) {
  const valErrors = validationResult(req).errors

  if (valErrors.length > 0) {
    let errorField = '' // to get first error of each field

    const validationMsg = valErrors.reduce((acc, error) => {
      if (error.param === errorField) {
        // in fist time and then error about such field already have in obj
        return acc
      }
      errorField = error.param
      acc[`${error.param}Error`] = error.msg

      return acc
    }, {})

    return res.status(400).json({
      errorType: 'Incorrect data error!',
      errorMsgObject: validationMsg,
    })
  }

  next()
}

module.exports = {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  isPasswordEmpty,
  validatePasswordConfirm,
  validationErrorHandler,
}
