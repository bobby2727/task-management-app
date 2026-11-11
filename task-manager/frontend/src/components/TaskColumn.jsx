
import TaskCard from "./TaskCard";

function TaskColumn({ title, tasks, onEdit, onDelete }) {
  return (
    <div className="task-column">

      <div className="task-column-header">
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="task-column-content">

        {tasks.length === 0 ? (
          <div className="column-empty">
            No tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}

      </div>

    </div>
  );
}

export default TaskColumn;
