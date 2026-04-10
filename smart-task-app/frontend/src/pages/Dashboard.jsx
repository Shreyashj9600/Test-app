import { useEffect, useState } from "react";
import API from "../api/axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";


const socket = io("http://localhost:5000");

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= GET TASKS =================
  const getTasks = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/tasks?status=${statusFilter}&priority=${priorityFilter}&page=${page}&limit=5`
      );

      setTasks(res.data.tasks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE TASK =================
  const createTask = async () => {
    if (!title) return alert("Enter task title");

    await API.post("/tasks", {
      title,
      status: "TODO",
      priority: "MEDIUM",
    });

    setTitle("");
    getTasks();
  };

  // ================= DELETE TASK =================
  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    getTasks();
  };

  // ================= EDIT TASK =================
  const editTask = async () => {
    await API.put(`/tasks/${editId}`, {
      title,
    });

    setEditId(null);
    setTitle("");
    getTasks();
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ================= SOCKET + LOAD =================
  useEffect(() => {
    getTasks();

    socket.on("taskCreated", getTasks);
    socket.on("taskUpdated", getTasks);
    socket.on("taskDeleted", getTasks);

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [page, statusFilter, priorityFilter]);

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <h1>Task Dashboard</h1>
        <button className="logoutBtn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <select onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priority</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <button onClick={getTasks}>Apply</button>
      </div>

      {/* CREATE TASK */}
      <div className="taskBox">
        <input
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {editId ? (
          <button className="updateBtn" onClick={editTask}>
            Update
          </button>
        ) : (
          <button className="addBtn" onClick={createTask}>
            Add
          </button>
        )}
      </div>

      {/* TASK LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <div className="taskList">
          {tasks.map((task) => (
            <div className="card" key={task._id}>
              <div>
                <h3>{task.title}</h3>
                <p className="meta">
                  {task.status} | {task.priority}
                </p>
              </div>

              <div className="actions">
                <button
                  className="editBtn"
                  onClick={() => {
                    setEditId(task._id);
                    setTitle(task.title);
                  }}
                >
                  Edit
                </button>

                <button
                  className="deleteBtn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}