const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { auth, isAdmin } = require('../middleware/auth');

// Create a task (Admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    const { title, description, assignedUser, dueDate, project } = req.body;

    if (!title || !assignedUser || !dueDate || !project) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const newTask = new Task({
            title,
            description,
            assignedUser,
            dueDate,
            project
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get tasks
router.get('/', auth, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find().populate('assignedUser', 'name email').populate('project', 'title');
        } else {
            tasks = await Task.find({ assignedUser: req.user._id }).populate('project', 'title');
        }
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.user.role === 'admin') {
            // Admin can update anything
            task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        } else {
            // Member can only update status if assigned to them
            if (task.assignedUser.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this task' });
            }
            task.status = status || task.status;
            await task.save();
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task Admin only
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Dashboard stats
router.get('/stats', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.assignedUser = req.user._id;
        }

        const tasks = await Task.find(query);
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const pending = tasks.filter(t => t.status === 'Pending').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        
        const now = new Date();
        const overdue = tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < now).length;

        res.json({ total, completed, pending, inProgress, overdue });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
