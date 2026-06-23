// Connect to backend
const socket = io("http://localhost:5000");

// Get token from localStorage
const token = localStorage.getItem("token");

// Redirect to login if token is missing
if (!token) {
  window.location.href = "login.html";
}

// DOM elements
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const taskList = document.getElementById("taskList");

const commentForm = document.getElementById("commentForm");
const commentText = document.getElementById("commentText");
const commentList = document.getElementById("commentList");

let selectedTaskId = null;

// Project ID
const PROJECT_ID = "6a3580d4c00a3316318ed7e1";

// Add Task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/tasks",
      {
        title: taskTitle.value,
        description: taskDesc.value,
        status: "todo",
        project: PROJECT_ID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Task created:", res.data);

    taskTitle.value = "";
    taskDesc.value = "";

    // Refresh task list
    loadTasks(PROJECT_ID);

  } catch (err) {
    console.error("Error creating task:", err);
  }
});

// Add Comment
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedTaskId) {
    alert("Please select a task first!");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/comments",
      {
        text: commentText.value,
        task: selectedTaskId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Comment added:", res.data);

    commentText.value = "";

    // Refresh comments
    loadComments(selectedTaskId);

  } catch (err) {
    console.error("Error adding comment:", err);
  }
});

// Real-time task updates
socket.on("taskCreated", (task) => {
  loadTasks(PROJECT_ID);
});

// Real-time comment updates
socket.on("commentAdded", () => {
  if (selectedTaskId) {
    loadComments(selectedTaskId);
  }
});

// Load comments
async function loadComments(taskId) {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/comments/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    commentList.innerHTML = "";

    res.data.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = `${c.author.name}: ${c.text}`;
      commentList.appendChild(li);
    });

  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

// Load tasks
async function loadTasks(projectId) {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/tasks/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    taskList.innerHTML = "";

    res.data.forEach((task) => {
      const li = document.createElement("li");

      li.textContent = `${task.title} — ${task.status}`;
      li.dataset.taskId = task._id;

      li.addEventListener("click", () => {
        selectedTaskId = task._id;

        loadComments(selectedTaskId);

        [...taskList.children].forEach((child) =>
          child.classList.remove("selected")
        );

        li.classList.add("selected");
      });

      taskList.appendChild(li);
    });

  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

// Load tasks on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTasks(PROJECT_ID);
});