import { fetchEmployee } from "../../../assets/js/exportFun.js";
// add tasks to Table from json

async function getTask() {
  try {
    let getData = await fetchEmployee("../../../assets/js/json/tasks.json");
    const loggedEmployee = JSON.parse(localStorage.getItem("employee"));

    const allTasks = getData.filter((t) => t.employeeId === loggedEmployee.id);

    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    createTable(allTasks);

    return allTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

function createTable(Tasks) {
  // create Table Header
  let table = document.querySelector("#tasksTable");
  table.innerHTML = "";
  let tableHeader = document.createElement("thead");
  let tableHeadRow = document.createElement("tr");
  tableHeadRow.classList.add("text-nowrap", "text-center");
  ["ID", "Task", "Status", "Progress"].forEach((text) => {
    let tableHead = document.createElement("th");
    tableHead.textContent = text;
    tableHeadRow.appendChild(tableHead);
  });
  tableHeader.appendChild(tableHeadRow);
  table.appendChild(tableHeader);

  // create Table Body
  let tableBody = document.createElement("tbody");
  tableBody.classList.add("text-center");
  table.appendChild(tableBody);
  let savedTasks = JSON.parse(localStorage.getItem("allTasks")) || {};
  Tasks.forEach((task, index) => {
    let tableBodyRow = document.createElement("tr");
    tableBodyRow.classList.add("text-nowrap");
    tableBodyRow.dataset.id = task.id;
    // ID creation
    let tdId = document.createElement("td");
    tdId.textContent = index + 1;
    tableBodyRow.appendChild(tdId);

    // task creation
    let tdTask = document.createElement("td");
    tdTask.innerHTML = `${task.description}<br/><p>${task.title}</p>`;
    tableBodyRow.appendChild(tdTask);

    // status buttons
    const tdStatus = document.createElement("td");
    let statusButton = document.createElement("button");
    statusButton.classList.add("btn", "rounded", "status-btn");
    let save = savedTasks[task.id] || {};
    let statusText = save.status || "Not Started";
    statusButton.textContent = statusText;
    tdStatus.appendChild(statusButton);
    tableBodyRow.appendChild(tdStatus);

    // progress Button
    let tdProgress = document.createElement("td");
    let progressButton = document.createElement("button");
    progressButton.classList.add("btn", "rounded", "progress-btn");
    let progressText = save.progress || "Waiting";
    progressButton.textContent = progressText;
    tdProgress.appendChild(progressButton);
    tableBodyRow.appendChild(tdProgress);
    tableBody.appendChild(tableBodyRow);
  });
  addRowEvents();
}

// addRowEvents
function addRowEvents() {
  let rows = document.querySelectorAll("#tasksTable tbody tr");
  let savedTasks = JSON.parse(localStorage.getItem("allTasks")) || {};
  rows.forEach((row) => {
    let taskId = row.dataset.id;
    let statusButton = row.querySelector(".status-btn");
    let progressButton = row.querySelector(".progress-btn");
    applyStyles(statusButton, progressButton);
    statusButton.addEventListener("click", () => {
      if (statusButton.disabled) return;
      if (statusButton.textContent === "Not Started") {
        statusButton.textContent = "In Progress";
        statusButton.className = "btn rounded status-btn";
        progressButton.textContent = "Do Task";
        progressButton.className = "btn rounded progress-btn";
        saveStatus(taskId, "In Progress", "Do Task");
        applyStyles(statusButton, progressButton);
      } else if (statusButton.textContent === "In Progress") {
        statusButton.textContent = "Waiting Approve";
        statusButton.className = "btn rounded status-btn";
        progressButton.textContent = "Pending";
        progressButton.className = "btn rounded progress-btn";
        saveStatus(taskId, "Waiting Approve", "Pending");
        applyStyles(statusButton, progressButton);
      } else if (statusButton.textContent === "Waiting Approve") {
        approveTask(taskId, statusButton, progressButton);
      }
    });
  });
}

function approveTask(taskId, statusBtn, progressBtn) {
  statusBtn.textContent = "Done";
  progressBtn.textContent = "Complete";

  statusBtn.className = "btn rounded status-btn btn-success";
  statusBtn.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
  statusBtn.style.color = "#3fc28a";
  statusBtn.disabled = true;

  progressBtn.className = "btn rounded progress-btn btn-success";
  progressBtn.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
  progressBtn.style.color = "#3fc28a";
  progressBtn.disabled = true;

  saveStatus(taskId, "Done", "Complete");
}

function applyStyles(statusBtn, progressBtn) {
  if (statusBtn.textContent === "Done") {
    statusBtn.className = "btn rounded status-btn btn-success";
    statusBtn.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
    statusBtn.style.color = "#3fc28a";
    statusBtn.disabled = true;

    progressBtn.className = "btn rounded progress-btn btn-success";
    progressBtn.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
    progressBtn.style.color = "#3fc28a";
    progressBtn.disabled = true;
  } else if (statusBtn.textContent === "Waiting Approve") {
    statusBtn.className = "btn rounded status-btn btn-warning";
    statusBtn.style.backgroundColor = "rgba(239, 190, 18, 0.1)";
    statusBtn.style.color = "#efbe12";
    statusBtn.disabled = false;

    progressBtn.className = "btn rounded progress-btn btn-secondary";
    progressBtn.style.backgroundColor = "rgba(239, 190, 18, 0.1)";
    progressBtn.style.color = "#efbe12";
    progressBtn.disabled = false;
  } else if (statusBtn.textContent === "In Progress") {
    statusBtn.className = "btn rounded status-btn btn-secondary";
    statusBtn.style.backgroundColor = "";
    statusBtn.style.color = "";

    progressBtn.className = "btn rounded progress-btn btn-secondary";
    progressBtn.style.backgroundColor = "";
    progressBtn.style.color = "";
    progressBtn.disabled = false;
  } else if (statusBtn.textContent === "Not Started") {
    statusBtn.className = "btn rounded status-btn btn-info";
    statusBtn.style.backgroundColor = "";
    statusBtn.style.color = "";

    progressBtn.className = "btn rounded progress-btn btn-warning";
    progressBtn.style.backgroundColor = "";
    progressBtn.style.color = "";
    progressBtn.disabled = false;
  }
}

function saveStatus(taskId, status, progress) {
  let savedTasks = JSON.parse(localStorage.getItem("allTasks")) || {};
  savedTasks[taskId] = { status, progress };
  localStorage.setItem("allTasks", JSON.stringify(savedTasks));
}

getTask();

// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Load last saved theme
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.setAttribute("data-bs-theme", "dark");
  themeIcon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
    document.documentElement.setAttribute("data-bs-theme", "light");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  }
});
