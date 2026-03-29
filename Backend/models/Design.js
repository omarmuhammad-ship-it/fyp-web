const mongoose = require("mongoose")

const DesignSchema = new mongoose.Schema({
  title: String,
  image: String,
  parent: {
    type: String,
    default: null
  },
  comments: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Design", DesignSchema)