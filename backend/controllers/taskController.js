const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title Is Required"
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            user: req.user._id
        });

        res.status(201).json({
            message: "Task Created Successfully",
            task
        });
    } catch (error) {
        console.log("Create Task Error", error.message);
        res.status(500).json({
            message: "Server Error while creating task"
        });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const { status, priority, search, sortBy } = req.query;

        // Base filter for logged-in user
        const filter = {
            user: req.user._id
        };

        // Filter by status
        if (status) {
            if (!["Todo", "In Progress", "Completed"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid task status"
                });
            }
            filter.status = status;
        }

        // Filter by priority
        if (priority) {
            if (!["Low", "Medium", "High"].includes(priority)) {
                return res.status(400).json({
                    message: "Invalid task priority"
                });
            }
            filter.priority = priority;
        }

        // Optional: Search by title regex
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        // 1. Fixed: Actually use the filter object here!
        let query = Task.find(filter);

        // Optional sorting
        if (sortBy === "oldest") {
            query = query.sort({ createdAt: 1 });
        } else {
            query = query.sort({ createdAt: -1 }); // Default newest first
        }

        const tasks = await query;

        res.status(200).json({
            message: "Tasks Fetched Successfully",
            totalTasks: tasks.length,
            tasks
        });
    } catch (error) {
        console.log("Get Tasks Error", error.message);
        res.status(500).json({
            message: "Server error While fetching Tasks"
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;

        // Find task belonging to logged-in user
        const task = await Task.findOne({
            _id: id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task Not Found"
            });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate;

        const updatedTask = await task.save();

        res.status(200).json({
            message: "Task Updated Successfully",
            task: updatedTask // 2. Fixed: returning updatedTask variable instead of function name
        });

    } catch (error) {
        console.log("Updated Task Error:", error.message);

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid task data or Task Id"
            });
        }
        res.status(500).json({
            message: "Server Error While Updating Task"
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedTask = await Task.findOneAndDelete({
            _id: id,
            user: req.user._id 
        });

        if (!deletedTask) { // 3. Fixed: checking deletedTask variable instead of function name
            return res.status(404).json({
                message: "Task not Found"
            });
        }

        res.status(200).json({
            message: "Task deleted Successfully",
            task: deletedTask
        });
    } catch (error) {
        console.log("Delete Task Error:", error.message);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        res.status(500).json({
            message: "Server error while deleting task"
        });
    }
};

module.exports = { createTask, getAllTasks, updateTask, deleteTask };