import Task from "../models/Task.js";
import { io } from "../app.js";

// CREATE TASK
export const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            userId: req.user.id, // IMPORTANT
        });
        io.emit("taskCreated", task);

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET TASKS
export const getTasks = async (req, res) => {
    try {
        const { status, priority, page = 1, limit = 5 } = req.query;

        const filter = { userId: req.user.id };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const tasks = await Task.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Task.countDocuments(filter);

        res.json({
            tasks,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        io.emit("taskUpdated", updated);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await Task.findByIdAndDelete(req.params.id);
        io.emit("taskDeleted", task._id);

        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};