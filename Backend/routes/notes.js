const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route 1:  Get All the notes of specific user..
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ errors: "Internal Server Error" });
  }
});

// Route 2:  Add new notes POST "/api/notes/addnote"   (Login is required).
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter title of Note with at least 3 characters").isLength({
      min: 3,
    }),
    body("description", "Enter the Description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors, then return Bad request and errors with them.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ errors: "Internal Server Error" });
    }
  }
);

// Route 3:  Update the existing notes POST "/api/notes/updatenote"   (Login is required).
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //Find the Note for updation..
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ errors: "Internal Server Error" });
  }
});

// Route 4:  Delete the existing note using  DELETE "/api/notes/deletenote"   (Login is required).
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Find the Note which we want to delete..
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow to delete, if user has this particular note.
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note Deleted Successfully", note: note });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ errors: "Internal Server Error" });
  }
});

module.exports = router;
