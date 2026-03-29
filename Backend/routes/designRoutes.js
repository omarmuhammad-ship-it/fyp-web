const express = require("express")
const router = express.Router()
const Design = require("../models/Design")

console.log("DESIGN ROUTES LOADED")

// GET ALL
router.get("/", async (req, res) => {
  try {
    const designs = await Design.find().sort({ _id: -1 })
    res.json(designs)
  } catch (err) {
    console.error("GET ERROR:", err)
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
    console.error("POST ERROR:", err)
    res.status(500).json({ error: "Failed to create design" })
  }
})

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Design.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: "Not found" })
    }

    res.json({ message: "Deleted OK" })
  } catch (err) {
    console.error("DELETE ERROR:", err)
    res.status(500).json({ error: "Delete failed" })
  }
})

module.exports = router