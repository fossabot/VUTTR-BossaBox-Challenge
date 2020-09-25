const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  loginIdentifier: {
    type: String,
    required: true
  },
  loginMethods: {
    type: [String],
    required: true
  },
  authorized: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
