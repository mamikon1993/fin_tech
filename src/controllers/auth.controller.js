const UserModel = require('../models/Users')
const BooksModel = require('../models/Books')
const GamesModel = require('../models/Games')
const MessageModel = require('../models/Message')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library')
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const ConfirmCodeModel = require('../models/ConfirmCode')
const sendCodeToEmail = require('../utils/sendCodeToEmail')
const generateCode = require('../utils/generateCode')
const putConfirmCodeToDb = require('../utils/putCodeToDb')
const JWTHandler = require('../services/jwtHandler')

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
    console.log('ver', email)
    const user = await UserModel.findOne({ email })

      // Generate confirmCode, send and put in the DBemail
    const confirmCode = generateCode()
    sendCodeToEmail(email, confirmCode)
    putConfirmCodeToDb(user._id, confirmCode)
    console.log('confirmCode --->', confirmCode, '<---')

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
// async function verificationCode(req, res) {
//   try {
//     const { email } = req.body

//     // Check user with such phone exist or not
//     const user = await UserModel.findOne({ email })

//     if (!user) {
//       // No such user case
//       return res.status(400).json({
//         errorType: 'Incorrect data error!',
//         errorMsg: 'User with such email not found',
//       })
//     }

//     // Generate confirmCode, send and put in the DB
//     const confirmCode = generateCode()
//     sendCodeToEmail(req.body.email, confirmCode)
//     putConfirmCodeToDb(user._id, confirmCode)
//     console.log('confirmCode --->', confirmCode, '<---')

//     res.json({
//       message: `Password recovery code was send on the user's email`,
//     })
//   } catch (e) {
//     console.log(`Error in file: ${__filename}!`)
//     console.log(e.message)
//     res.status(500).json({
//       errorType: 'Server side error!',
//       errorMsg: e.message,
//     })
//   }
// }
async function emailVerification(req, res) {
  try {
    // const phone = req.body.phone
    const { email } = req.body

    // change user phone info in DB
    const user = await UserModel.findOne({ email })

    // Check phone already verified or no
    if (user.isEmailVerified) {
      return res.status(400).json({
        errorType: 'Verified error!',
        errorMessage: 'User email already verified.',
      })
    }

    // Change isEmailVerified in DB
    user.isEmailVerified = true
    await user.save()

    // Change confirm code status in DB
    const codeInfo = await ConfirmCodeModel.findOne({
      userId: user._id,
    }).populate('userId')
    codeInfo.isUsed = true
    await codeInfo.save()

    res.json({
      message: 'User sent right code and email has been verified.',
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}
// async function loginWithEmail(req, res) {
//   try {
//     const { email, password } = req.body

//     // Search user in DB
//     const user = await UserModel.findOne({ email })
//     // Check such username[phone] registered or not
//     if (!user) {
//       // User with such username[phone] not exist
//       return res.status(400).json({
//         errorType: 'Incorrect data error!',
//         errorMsg: 'You have entered an incorrect email or password',
//       })
//     }

//     // Check password
//     const isPasswordCorrect = await bcrypt.compare(password, user.password)

//     if (!isPasswordCorrect) {
//       return res.status(400).json({
//         errorType: 'Incorrect data error!',
//         errorMsg: 'You have entered an incorrect email or password',
//       })
//     }

//     // Create JWT
//     const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     })
//     res.json({ message: 'Login success.', accessToken })
//   } catch (e) {
//     console.log(`Error in file: ${__filename}!`)
//     console.log(e.message)
//     res.status(500).json({
//       errorType: 'Server side error!',
//       errorMsg: e.message,
//     })
//   }
// }

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

async function resetPassword(req, res) {
  try {
    // Get phone and password from req.body
    const { email, password } = req.body

    // Here email we get from frontend and we now what it is right email //
    // Find user in DB
    const user = await UserModel.findOne({ email })
    // Change user password
    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword
    await user.save()

    // Change confirm code status in DB
    const codeInfo = await ConfirmCodeModel.findOne({
      userId: user._id,
    }).populate('userId')
    codeInfo.isUsed = true
    await codeInfo.save()

    res.status(201).json({
      message: 'Password was changed successfully.',
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

async function loginWithGoogle(req, res) {
  try {
    const { tokenId } = req.body

    // Get user data from token
    const clientObject = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const googleUserData = clientObject.payload

    // Get user data from db
    let userFromDb = await UserModel.findOne({ googleId: googleUserData.sub })

    // Check user exist in db or no
    if (!userFromDb) {
      // If user registered first time
      userFromDb = await UserModel.create({
        googleId: googleUserData.sub,
        firstName: googleUserData.given_name,
        lastName: googleUserData.family_name,
        email: googleUserData.email,
        isEmailVerified: googleUserData.email_verified,
        avatar: googleUserData.picture,
      })
    }

    // Create JWT
    const accessToken = JWTHandler.createAccessToken(userFromDb._id)
    const refreshToken = JWTHandler.createRefreshToken(userFromDb._id)

    res.json({
      message: 'Login with google success.',
      accessToken,
      refreshToken,
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

async function getProducts(req, res) {
  try {
    const { category } = req.body

    const adults = await BooksModel.find({ category })
    const games = await GamesModel.find({ category })
    if (adults.length > 0) {
      res.json({
        message: 'Book for Adults was found',
        books: adults,
      })
    } else if (games.length > 0) {
      res.json({
        message: 'Book for Games was found',
        books: games,
      })
    } else {
      return res.status(400).json({
        errorMsg: 'Category not found',
      })
    }
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function sendMessage(req, res) {
  try {
    const { firstName, email, text } = req.body

    const newQuestion = await MessageModel.create({
      firstName,
      email,
      text,
    })
    if (newQuestion) {
      res.status(201).json({
        message: 'Message was sent.',
      })
    }
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

async function search(req, res, next) {
  try {
    let book = await req.query.name
    // let game = await req.query.name
    // if (book.length > 0){
    BooksModel.find({
      name: { $regex: book, $options: '$i' },
    }).then((data) => {
      res.send(data)
    })
    //} else {
    //   return res.status(400).json({
    //     errorMsg: 'Not found',
    //   })
    // }
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

module.exports = {
  register,
  // loginWithEmail,
  getEmailToResetPassword,
  //verificationCode,
  resetPassword,
  loginWithGoogle,
  emailVerification,
  getProducts,
  sendMessage,
  search,
}
