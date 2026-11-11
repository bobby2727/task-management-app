const express = require("express")
const router = express.Router()
const {createTask, getAllTasks, updateTask, deleteTask} = require("../controllers/taskController")

const protect = require("../middleware/authMiddleware")

// Protected Create Task API
router.post("/", protect, createTask);

router.get("/", protect, getAllTasks);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

module.exports = router