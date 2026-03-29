const express = require("express")
const router = express.Router()
const Design = require("../models/Design")
console.log("DESIGN ROUTES LOADED")

// GET ALL
router.get("/", async (req, res) => {
  const designs = await Design.find()
  res.json(designs)
})

// CREATE
router.post("/", async (req, res) => {
  const design = new Design(req.body)
  await design.save()
  res.json(design)
})

// DELETE ✅
router.delete("/:id", async (req, res) => {
  console.log("DELETE ROUTE HIT:", req.params.id)

  try {
    const deleted = await Design.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: "Not found" })
    }

    res.json({ message: "Deleted OK" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Delete failed" })
  }
})

module.exports = router