const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Create a new project (Admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newProject = new Project({
            title,
            description,
            creator: req.user._id,
            members: [req.user._id] // creator is automatically a member
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get projects for current user
router.get('/', auth, async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'admin') {
            projects = await Project.find()
                .populate('creator', 'name email')
                .populate('members', 'name email');
        } else {
            projects = await Project.find({ members: req.user._id })
                .populate('creator', 'name email')
                .populate('members', 'name email');
        }
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add member to project (Admin only)
router.post('/:projectId/add-member', auth, isAdmin, async (req, res) => {
    const { email } = req.body;
    const { projectId } = req.params;

    try {
        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is already a member
        if (project.members.includes(userToAdd._id)) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        project.members.push(userToAdd._id);
        await project.save();

        res.json({ message: 'Member added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
