let tasks = [
    {
        id: 1,
        name: "Draft Project Proposal",
        dueDate: getTodayDate(),
        priority: "high",
        completed: false
    },
    {
        id: 2,
        name: "Take Trash Out",
        dueDate: getTomorrowDate(),
        priority: "medium",
        completed: false
    },
    {
        id: 3,
        name: "Get Groceries",
        dueDate: getTomorrowDate(),
        priority: "high",
        completed: false
    },
    {
        id: 4,
        name: "Send Mail",
        dueDate: getTomorrowDate(),
        priority: "medium",
        completed: false
    }
];

let currentFilter = "today";
let editTaskId = null;
let completedVisible = true;

/* DOM */
const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");

const todayBtn = document.getElementById("todayBtn");
const pendingBtn = document.getElementById("pendingBtn");
const overdueBtn = document.getElementById("overdueBtn");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskForm = document.getElementById("taskForm");
const taskNameInput = document.getElementById("taskName");
const taskDateInput = document.getElementById("taskDate");
const taskPriorityInput = document.getElementById("taskPriority");

const modalTitle = document.getElementById("modalTitle");

const toggleCompleted = document.getElementById("toggleCompleted");
const completedArrow = document.getElementById("completedArrow");

const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));

/* ---------- Dates ---------- */

function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

function getTomorrowDate() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

/* ---------- Task Card ---------- */

function createTaskCard(task, isCompleted = false) {
    return `
        <div class="tdx-card ${isCompleted ? "completed-task" : ""}">
            
            <div class="tdx-left">
                <input type="checkbox" class="form-check-input tdx-check"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTaskComplete(${task.id})">

                <p class="tdx-name">${task.name}</p>
            </div>

            <div class="tdx-mid">
                <i class="bi bi-clock"></i>
                <p class="tdx-date">${formatDate(task.dueDate)}</p>
            </div>

            <div class="tdx-right">
                <i class="bi bi-pencil-fill edit-icon" onclick="editTask(${task.id})"></i>
               
                <span class="tdx-dot ${task.priority}"></span>
            </div>

        </div>
    `;
}

/* ---------- Render ---------- */

function renderTasks() {
    taskList.innerHTML = "";
    completedList.innerHTML = "";

    let filtered = tasks.filter(t => !t.completed);

    if (currentFilter === "today") {
        filtered = filtered.filter(t => t.dueDate === getTodayDate());
    } else if (currentFilter === "pending") {
        filtered = filtered.filter(t => t.dueDate >= getTodayDate());
    } else if (currentFilter === "overdue") {
        filtered = filtered.filter(t => t.dueDate < getTodayDate());
    }

    if (filtered.length === 0) {
        taskList.innerHTML = `<div class="alert alert-light text-center border">No tasks found</div>`;
    } else {
        filtered.forEach(task => {
            taskList.innerHTML += createTaskCard(task);
        });
    }

    const completed = tasks.filter(t => t.completed);

    if (completed.length === 0) {
        completedList.innerHTML = `<div class="text-muted">No completed tasks yet.</div>`;
    } else {
        completed.forEach(task => {
            completedList.innerHTML += createTaskCard(task, true);
        });
    }

    completedList.style.display = completedVisible ? "block" : "none";
    completedArrow.textContent = completedVisible ? "▲" : "▼";
}

/* ---------- Add Task ---------- */

addTaskBtn.addEventListener("click", () => {
    editTaskId = null;
    taskForm.reset();
    taskDateInput.value = getTodayDate();
    modalTitle.textContent = "Add Task";
    taskModal.show();
});

/* ---------- Save Task ---------- */

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = taskNameInput.value.trim();
    const date = taskDateInput.value;
    const priority = taskPriorityInput.value;

    if (!name || !date) return;

    if (editTaskId === null) {
        tasks.push({
            id: Date.now(),
            name,
            dueDate: date,
            priority,
            completed: false
        });
    } else {
        const t = tasks.find(t => t.id === editTaskId);
        t.name = name;
        t.dueDate = date;
        t.priority = priority;
    }

    taskModal.hide();
    renderTasks();
});

/* ---------- Edit ---------- */

function editTask(id) {
    const t = tasks.find(t => t.id === id);

    editTaskId = id;
    modalTitle.textContent = "Edit Task";

    taskNameInput.value = t.name;
    taskDateInput.value = t.dueDate;
    taskPriorityInput.value = t.priority;

    taskModal.show();
}

function setActiveButton(activeBtn) {
    [todayBtn, pendingBtn, overdueBtn].forEach(btn => {
        btn.classList.remove("tdx-active");
    });
    activeBtn.classList.add("tdx-active");
}

/* ---------- Toggle Complete ---------- */

function toggleTaskComplete(id) {
    const t = tasks.find(t => t.id === id);
    t.completed = !t.completed;
    renderTasks();
}

/* ---------- Filters ---------- */

todayBtn.onclick = () => {
    currentFilter = "today";
    setActiveButton(todayBtn);
    renderTasks();
};

pendingBtn.onclick = () => {
    currentFilter = "pending";
    setActiveButton(pendingBtn);
    renderTasks();
};

overdueBtn.onclick = () => {
    currentFilter = "overdue";
    setActiveButton(overdueBtn);
    renderTasks();
};
/* ---------- Completed Toggle ---------- */

toggleCompleted.onclick = () => {
    completedVisible = !completedVisible;
    renderTasks();
};

/* ---------- Init ---------- */

window.onload = () => {
    taskDateInput.value = getTodayDate();
    renderTasks();
};