const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: { type: String },
    context: { type: String },
    category: { type: String },
    Image: { type: String },
  },
  {
    collection: 'Books',
    strict: false,
  }
)

module.exports = model('Books', userSchema)
