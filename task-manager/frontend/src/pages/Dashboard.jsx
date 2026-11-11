
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getTasks, deleteTask } from "../services/taskService";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import TaskColumn from "../components/TaskColumn";
import TaskForm from "../components/TaskForm";
import EditTaskForm from "../components/EditTaskForm";

import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks();

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

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate summary counts
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "Todo"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  // Add new task to Dashboard
  const handleTaskCreated = (newTask) => {
    setTasks((previousTasks) => [
      newTask,
      ...previousTasks
    ]);
  };

  // Update task in Dashboard
  const handleTaskUpdated = (updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );
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

  // Group tasks by status
  const todoList = tasks.filter(
    (task) => task.status === "Todo"
  );

  const inProgressList = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const completedList = tasks.filter(
    (task) => task.status === "Completed"
  );

  return (
    <div className="app-layout">

      <Navbar />

      <div className="app-body">

        <Sidebar />

        <main className="page-content">

          {/* Welcome */}
          <section className="dashboard-welcome">
            <div>
              <h1>
                Welcome back, {user?.name || "User"}!
              </h1>

              <p>
                Here's an overview of your tasks.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowTaskForm(true)}
            >
              + Create Task
            </button>
          </section>

          {/* Summary Cards */}
          <section className="summary-grid">

            <div className="summary-card">
              <p>Total Tasks</p>
              <h2>{totalTasks}</h2>
              <span>All your tasks</span>
            </div>

            <div className="summary-card">
              <p>To Do</p>
              <h2>{todoTasks}</h2>
              <span>Tasks waiting</span>
            </div>

            <div className="summary-card">
              <p>In Progress</p>
              <h2>{inProgressTasks}</h2>
              <span>Tasks ongoing</span>
            </div>

            <div className="summary-card">
              <p>Completed</p>
              <h2>{completedTasks}</h2>
              <span>Tasks finished</span>
            </div>

          </section>

          {/* Task Overview */}
          <section className="dashboard-tasks-section">

            <div className="section-heading">
              <div>
                <h2>Task Overview</h2>
                <p>Track your work by task status.</p>
              </div>

              <button
                className="secondary-button"
                onClick={() => navigate("/tasks")}
              >
                View All Tasks
              </button>
            </div>

            {loading && (
              <Loader message="Loading your tasks..." />
            )}

            {!loading && error && (
              <div className="page-error">
                {error}
                <button onClick={fetchTasks}>
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="task-columns">

                <TaskColumn
                  title="To Do"
                  tasks={todoList}
                  onEdit={setSelectedTask}
                  onDelete={handleDeleteTask}
                />

                <TaskColumn
                  title="In Progress"
                  tasks={inProgressList}
                  onEdit={setSelectedTask}
                  onDelete={handleDeleteTask}
                />

                <TaskColumn
                  title="Completed"
                  tasks={completedList}
                  onEdit={setSelectedTask}
                  onDelete={handleDeleteTask}
                />

              </div>
            )}

          </section>

        </main>

      </div>

      {/* Create Task Modal */}
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {/* Edit Task Modal */}
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

export default Dashboard;
