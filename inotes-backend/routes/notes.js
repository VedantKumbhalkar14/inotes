const express = require("express");
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Notes = require("../models/Notes");
const { body, validationResult } = require('express-validator');

//get all user notes
// endpoint- /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        let notes = await Notes.find({ user: req.user.id });
        return res.json({ notes });
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
})

router.post('/addnote', fetchUser, [
    body('title', 'Title must be minimum 3 characters long!').isLength({ min: 3 }),
    body('description', 'Description must be minimum 5 characters long').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body
        let note = new Notes({
            title: title,
            description: description,
            tag: tag,
            user: req.user.id
        })
        note = await note.save();
        return res.json({ note });
    }
    catch (err) {
        if (err) {
            res.status(400).send("Internal Server Error");
        }
    }
})


module.exports = router;