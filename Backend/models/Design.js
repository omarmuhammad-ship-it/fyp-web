const mongoose = require("mongoose")

const DesignSchema = new mongoose.Schema({

  image: String,

  caption: {
    type: String,
    default: ""
  },

  comment: {
    type: String,
    default: ""
  },

  parent: {
    type: String,
    default: null
  },

  creator: {
    type: String,
    default: "anonymous"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Design", DesignSchema)