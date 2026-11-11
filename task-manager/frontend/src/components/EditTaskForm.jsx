
import { useState } from "react";
import { updateTask } from "../services/taskService";
import "./TaskForm.css";

function EditTaskForm({ task, onClose, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    priority: task.priority || "Medium",
    status: task.status || "Todo",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : ""
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
      setError("Task title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await updateTask(task._id, {
        ...formData,
        title: formData.title.trim(),
        dueDate: formData.dueDate || null
      });

      onTaskUpdated(response.task);
      onClose();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update task."
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
            <h2>Edit Task</h2>
            <p>Update your task details.</p>
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
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="task-form-group">
            <label>Description</label>

            <textarea
              name="description"
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
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditTaskForm;
