const express = require('express');
const Task = require('../model/task');
const router = express.Router();
const auth = require('../middleware/auth'); // ✅ import middleware

// Create task (protected)
router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            project: req.body.project,
            assignedTo: req.body.assignedTo
        });
        await task.save();

        // 🔥 Broadcast event to all connected clients
        req.io.emit("taskCreated", task);

        res.json(task);
    } catch (err) {
    console.log("Task Create Error:", err);
    res.status(400).json({ error: err.message });
}
});

// Get tasks by project (protected)
router.get('/:projectId', auth, async (req, res) => {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo');
    res.json(tasks);
});

// Update task status
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }   // <-- ensures updated task is returned
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔥 Broadcast update event
    req.io.emit("taskUpdated", task);

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔥 Broadcast delete event
    req.io.emit("taskDeleted", deletedTask);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
