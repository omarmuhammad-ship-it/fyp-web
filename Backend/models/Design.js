const mongoose = require("mongoose")

const DesignSchema = new mongoose.Schema({
  image: String,
  caption: String,
  creator: String,

  parent: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  comment: String

}, { timestamps: true })

module.exports = mongoose.model("Design", DesignSchema)