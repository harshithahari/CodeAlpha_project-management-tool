const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();
const auth = require('../middleware/auth');

// Add comment (protected)
router.post('/', auth, async (req, res) => {
    try {
        const comment = new Comment({
            text: req.body.text,
            task: req.body.task,
            author: req.user.id   // Logged-in user becomes author
        });

        await comment.save();

        // Populate author before sending response
        await comment.populate('author', 'name');

        // Broadcast event
        req.io.emit("commentAdded", comment);

        res.json(comment);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get comments by task (protected)
router.get('/:taskId', auth, async (req, res) => {
    try {
        const comments = await Comment.find({
            task: req.params.taskId
        }).populate('author', 'name');

        res.json(comments);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;