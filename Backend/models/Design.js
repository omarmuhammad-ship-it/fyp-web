const mongoose = require("mongoose")

const DesignSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false
  },
  caption: {
    type: String,
    required: false
  },
  creator: {
    type: String,
    required: false
  },
  parent: {
    type: String,
    default: null
  },
  comment: {
    type: String,
    default: null
  }
}, { timestamps: true })

module.exports = mongoose.model("Design", DesignSchema)