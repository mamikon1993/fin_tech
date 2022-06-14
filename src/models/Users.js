const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    googleId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    avatar: { type: String },
  },
  {
    collection: 'users',
    strict: false,
  }
)

module.exports = model('User', userSchema)
