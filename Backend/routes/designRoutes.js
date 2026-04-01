const express = require("express")
const router = express.Router()
const Design = require("../models/Design")

// GET ALL (FAST + THREAD SAFE)
router.get("/", async (req, res) => {
  try {

    const designs = await Design.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    res.json(designs)

  } catch (err) {
    console.error("FETCH ERROR:", err)
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
    console.error("CREATE ERROR:", err)
    res.status(500).json({ error: "Failed to create design" })
  }
})

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    console.error("DELETE ERROR:", err)
    res.status(500).json({ error: "Delete failed" })
  }
})

module.exports = router