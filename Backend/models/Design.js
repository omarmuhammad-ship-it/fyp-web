const mongoose = require("mongoose")

const DesignSchema = new mongoose.Schema({
  image: String,
  creator: String,
  parent: String,
  comment: String,
  caption: String,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Design", DesignSchema)