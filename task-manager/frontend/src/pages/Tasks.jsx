
import { useEffect, useState } from "react";

import { getTasks, deleteTask } from "../services/taskService";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import EditTaskForm from "../components/EditTaskForm";

import "./Dashboard.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks using current filters
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks({
        search,
        status,
        priority,
        sortBy,
        order
      });

      setTasks(response.tasks || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to fetch tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever filters or sorting change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status, priority, sortBy, order]);

  // Add task
  const handleTaskCreated = (newTask) => {
    setShowTaskForm(false);
    fetchTasks();
  };

  // Update task
  const handleTaskUpdated = (updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );

    setSelectedTask(null);

    // Reapply the current filters and sorting
    fetchTasks();
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task._id !== taskId
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to delete task."
      );
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setSortBy("createdAt");
    setOrder("desc");
  };

  return (
    <div className="app-layout">

      <Navbar />

      <div className="app-body">

        <Sidebar />

        <main className="page-content">

          {/* Page Heading */}
          <section className="tasks-page-heading">

            <div>
              <h1>My Tasks</h1>
              <p>Manage and organize all your tasks.</p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowTaskForm(true)}
            >
              + Create Task
            </button>

          </section>

          {/* Search and Filters */}
          <section className="filter-section">

            <div className="search-box">
              <input
                type="text"
                placeholder="Search by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-controls">

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>

              <button
                className="clear-filter-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          </section>

          {/* Task Results */}
          <section className="all-tasks-section">

            <div className="section-heading">
              <div>
                <h2>All Tasks</h2>
                <p>{tasks.length} task(s) found</p>
              </div>
            </div>

            {loading && (
              <Loader message="Loading tasks..." />
            )}

            {!loading && error && (
              <div className="page-error">
                {error}
                <button onClick={fetchTasks}>
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && tasks.length === 0 && (
              <div className="no-tasks-message">
                <div>📝</div>
                <h3>No tasks found</h3>
                <p>
                  Try changing your search or filters,
                  or create a new task.
                </p>
              </div>
            )}

            {!loading && !error && tasks.length > 0 && (
              <div className="all-tasks-grid">

                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={setSelectedTask}
                    onDelete={handleDeleteTask}
                  />
                ))}

              </div>
            )}

          </section>

        </main>

      </div>

      {/* Create Task */}
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {/* Edit Task */}
      {selectedTask && (
        <EditTaskForm
          key={selectedTask._id}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

    </div>
  );
}

export default Tasks;
