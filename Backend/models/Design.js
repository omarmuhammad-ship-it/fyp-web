const mongoose = require("mongoose")

const DesignSchema = new mongoose.Schema({
  image: String,
  caption: String,
  creator: String,
  parent: String,
  comment: String
}, { timestamps: true })

module.exports = mongoose.model("Design", DesignSchema)