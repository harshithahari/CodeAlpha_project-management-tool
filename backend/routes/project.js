const express = require('express');
const Project = require('../model/project');
const router = express.Router();
const auth = require('../middleware/auth'); // ✅ import middleware

// Create project (protected)
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id   // ✅ automatically use logged-in user
    });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all projects (protected)
router.get('/', auth, async (req, res) => {
  const projects = await Project.find({ owner: req.user.id }).populate('owner members');
  res.json(projects);
});

module.exports = router;
