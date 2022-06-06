const UserModel = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendCodeToEmail = require('../utils/sendCodeToEmail')
const generateCode = require('../utils/generateCode')
const putConfirmCodeToDb = require('../utils/putCodeToDb')

async function register(req, res) {
  try {
    const { firstName, lastName, password, email } = req.body

    // Check if exist user with such mail
    const existingUser = await UserModel.findOne({
      email,
    })
    const usernameExists = existingUser !== null

    if (usernameExists) {
      return res.status(400).json({
        message: 'This email already registered.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await UserModel.create({
      firstName,
      lastName,
      password: hashedPassword,
      email,
    })

    res.status(201).json({
      message: 'Registration success.',
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

async function loginWithEmail(req, res) {
  try {
    const { email, password } = req.body

    // Search user in DB
    const user = await UserModel.findOne({ email })
    // Check such username[phone] registered or not
    if (!user) {
      // User with such username[phone] not exist
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMsg: 'You have entered an incorrect email or password',
      })
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMsg: 'You have entered an incorrect email or password',
      })
    }

    // Create JWT
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })
    res.json({ message: 'Login success.', accessToken })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

async function getEmailToResetPassword(req, res) {
  try {
    const { email } = req.body

    // Check user with such phone exist or not
    const user = await UserModel.findOne({ email })

    if (!user) {
      // No such user case
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMsg: 'User with such email not found',
      })
    }

    // Generate confirmCode, send and put in the DB
    const confirmCode = generateCode()
    sendCodeToEmail(req.body.email, confirmCode)
    putConfirmCodeToDb(user._id, confirmCode)
    console.log('confirmCode --->', confirmCode, '<---')

    res.json({
      message: `Password recovery code was send on the user's email`,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

async function verificationCode(req, res) {
  try {
    const { email } = req.body

    // Check user with such phone exist or not
    const user = await UserModel.findOne({ email })

    if (!user) {
      // No such user case
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMsg: 'User with such email not found',
      })
    }

    // Generate confirmCode, send and put in the DB
    const confirmCode = generateCode()
    sendCodeToEmail(req.body.email, confirmCode)
    putConfirmCodeToDb(user._id, confirmCode)
    console.log('confirmCode --->', confirmCode, '<---')

    res.json({
      message: `Password recovery code was send on the user's email`,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

module.exports = {
  register,
  loginWithEmail,
  getEmailToResetPassword,
  verificationCode,
}
