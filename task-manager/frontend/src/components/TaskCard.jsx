
function TaskCard({ task, onEdit, onDelete }) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <div className="task-card">

      <div className="task-card-top">
        <h3>{task.title}</h3>

        <span className={`priority-badge ${task.priority?.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>

      <p className="task-description">
        {task.description || "No description provided"}
      </p>

      <div className="task-card-info">
        <span className="task-due-date">
          📅 {formattedDate}
        </span>
      </div>

      <div className="task-card-actions">
        <button
          type="button"
          className="task-edit-button"
          onClick={() => onEdit(task)}
        >
          ✏️ Edit
        </button>

        <button
          type="button"
          className="task-delete-button"
          onClick={() => onDelete(task._id)}
        >
          🗑 Delete
        </button>
      </div>

    </div>
  );
}

export default TaskCard;
