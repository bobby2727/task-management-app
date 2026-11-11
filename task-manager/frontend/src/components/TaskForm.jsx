
import { useState } from "react";
import { createTask } from "../services/taskService";
import "./TaskForm.css";

function TaskForm({ onClose, onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    dueDate: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createTask({
        ...formData,
        title: formData.title.trim(),
        dueDate: formData.dueDate || null
      });

      onTaskCreated(response.task);
      onClose();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">

        <div className="task-modal-header">
          <div>
            <h2>Create New Task</h2>
            <p>Add a new task to your workspace.</p>
          </div>

          <button
            type="button"
            className="close-modal-button"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="task-form-group">
            <label>Task Title *</label>

            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="task-form-group">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="task-form-row">

            <div className="task-form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="task-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

          </div>

          <div className="task-form-group">
            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          {error && <p className="task-form-error">{error}</p>}

          <div className="task-form-actions">
            <button
              type="button"
              className="task-cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="task-save-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default TaskForm;
