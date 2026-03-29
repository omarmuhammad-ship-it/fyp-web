const express = require("express")
const router = express.Router()
const Design = require("../models/Design")

console.log("DESIGN ROUTES LOADED")

// GET ALL
router.get("/", async (req, res) => {
  try {
    const designs = await Design.find()
    res.json(designs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch designs" })
  }
})

// CREATE
router.post("/", async (req, res) => {
  try {
    const design = new Design(req.body)
    await design.save()
    res.json(design)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create design" })
  }
})

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Delete failed" })
  }
})

module.exports = router