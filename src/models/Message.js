const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    text: { type: String },
  },
  {
    collection: 'message',
    strict: false,
  }
)

module.exports = model('Message', userSchema)
