const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// DEBUG
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url)
  next()
})

// ROUTES
const designRoutes = require("./routes/designRoutes")
app.use("/designs", designRoutes)

// FRONTEND
const frontendPath = path.join(__dirname, "../Frontend")
app.use(express.static(frontendPath))

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"))
})

// CONNECT MONGO
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Mongo error:", err))

// START SERVER
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})