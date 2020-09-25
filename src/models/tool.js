const mongoose = require('mongoose')

const ToolSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: [],
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Tool', ToolSchema)
