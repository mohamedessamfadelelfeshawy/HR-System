import { fetchEmployee, getItem } from "../../../assets/js/exportFun.js";
// add tasks to Table from json

async function getTask() {
  try {
    let getData =getItem("allTasks")? getItem("allTasks"):await fetchEmployee(
      "../../../assets/js/json/personalTasks.json"
    );
    console.log(getData);
    
      localStorage.setItem("allTasks", JSON.stringify(getData));
    console.log("allTasks");
    
    let loggedEmployee = JSON.parse(localStorage.getItem("employee"));
    let allTasks = getData.filter((t) => t.employeeId === loggedEmployee.id);
    console.log(allTasks);
    
    createTable(allTasks);
    return allTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

function createTable(Tasks) {
  let table = document.querySelector("#tasksTable");
  table.innerHTML = "";
  let tableHeader = document.createElement("thead");
  let tableHeadRow = document.createElement("tr");
  tableHeadRow.classList.add("text-nowrap", "text-center");
  ["ID", "Task", "Status"].forEach((text) => {
    let tableHead = document.createElement("th");
    tableHead.textContent = text;
    tableHeadRow.appendChild(tableHead);
  });
  tableHeader.appendChild(tableHeadRow);
  table.appendChild(tableHeader);

  let tableBody = document.createElement("tbody");
  tableBody.classList.add("text-center");
  table.appendChild(tableBody);

  Tasks.forEach((task, index) => {
    let tableBodyRow = document.createElement("tr");
    tableBodyRow.classList.add("text-nowrap");
    tableBodyRow.dataset.id = task.id;

    let tdId = document.createElement("td");
    tdId.textContent = index + 1;
    tableBodyRow.appendChild(tdId);

    let tdTask = document.createElement("td");
    tdTask.innerHTML = `${task.description}<br/><p>${task.dueDate}</p>`;
    tableBodyRow.appendChild(tdTask);

    const tdStatus = document.createElement("td");
    let statusButton = document.createElement("button");
    statusButton.classList.add("btn", "rounded", "status-btn");
    let statusText = task.status || "Pending";
    statusButton.textContent = statusText;
    tdStatus.appendChild(statusButton);
    tableBodyRow.appendChild(tdStatus);

    tableBody.appendChild(tableBodyRow);
  });
  addRowEvents();
}

function addRowEvents() {
  let rows = document.querySelectorAll("#tasksTable tbody tr");
  rows.forEach((row) => {
    let taskId = row.dataset.id;
    let statusButton = row.querySelector(".status-btn");
    applyStyles(statusButton);
    statusButton.addEventListener("click", () => {
      if (statusButton.disabled) return;
      if (statusButton.textContent === "Pending") {
        statusButton.textContent = "In Progress";
        saveStatus(taskId, "In Progress");
      } else if (statusButton.textContent === "In Progress") {
        approveTask(taskId, statusButton);
      }
      applyStyles(statusButton);
    });
  });
}

function approveTask(taskId, statusBtn) {
  statusBtn.textContent = "Completed";
  statusBtn.className = "btn rounded status-btn btn-success";
  statusBtn.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
  statusBtn.style.color = "#3fc28a";
  statusBtn.disabled = true;
  saveStatus(taskId, "Completed");
}

function applyStyles(statusBtn) {
  if (statusBtn.textContent === "Completed") {
    statusBtn.className = "btn rounded status-btn btn-success";
    statusBtn.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
    statusBtn.style.color = "#3fc28a";
    statusBtn.style.border = "none";

    statusBtn.disabled = true;
  } else if (statusBtn.textContent === "In Progress") {
    statusBtn.className = "btn rounded status-btn btn-warning";
    statusBtn.style.backgroundColor = "rgba(159, 131, 30, 0.1)";
    statusBtn.style.color = "#79641b";
    statusBtn.style.border = "none";
    statusBtn.disabled = false;
  } else if (statusBtn.textContent === "Pending") {
    statusBtn.className = "btn rounded status-btn btn-info";
    statusBtn.style.backgroundColor = "rgba(239, 190, 18, 0.1)";
    statusBtn.style.color = "#efbe12";
    statusBtn.style.border = "none";
    statusBtn.disabled = false;
  }
}

function saveStatus(taskId, status) {
  let savedTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  let taskIndex = savedTasks.findIndex((t) => t.id == taskId);
  if (taskIndex !== -1) {
    savedTasks[taskIndex].status = status;
  }
  console.log(savedTasks);
  
  localStorage.setItem("allTasks", JSON.stringify(savedTasks));
}
getTask();

// logout
let logoutButton = document.querySelector("#logbtn");
logoutButton.addEventListener("click", (e) => {
  localStorage.removeItem("employee");
  window.location = "../../../index.html";
});

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
