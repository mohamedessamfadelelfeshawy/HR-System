
import {
  fetchEmployee,
  getItem,
  setItem,
} from "../../../assets/js/exportFun.js";

async function fetchedData() {
  try {
    // get all requests
    let allRequests = getItem("allRequests");
    if (!allRequests) {
      allRequests = await fetchEmployee(
        "../../../assets/js/json/requests.json"
      );
      setItem("allRequests", allRequests);
    }

    // get all employees
    let allEmployees = getItem("allEmployees");
    if (!allEmployees) {
      allEmployees = await fetchEmployee(
        "../../../assets/js/json/employee.json"
      );
      setItem("allEmployees", allEmployees);
    }

    createTable(allRequests, allEmployees);
  } catch (error) {
    console.error("error", error);
  }
}

function createTable(requests, employees) {
  let table = document.querySelector("#request-table");
  table.innerHTML = "";

  // Table Header
  let tableHeader = document.createElement("thead");
  let tableHeadRow = document.createElement("tr");
  tableHeadRow.classList.add("text-nowrap", "text-center");

  let headers = [
    "ID",
    "Employee Name",
    "Request Type",
    "Date",
    "Status",
    "Action",
  ];
  headers.forEach((text) => {
    let th = document.createElement("th");
    th.textContent = text;
    tableHeadRow.appendChild(th);
  });

  tableHeader.appendChild(tableHeadRow);
  table.appendChild(tableHeader);

  // Table Body
  let tableBody = document.createElement("tbody");
  tableBody.classList.add("text-center");
  table.appendChild(tableBody);

  requests.forEach((request) => {
    let row = document.createElement("tr");
    row.classList.add("text-nowrap");
    row.dataset.id = request.id;

    // ID
    let tdId = document.createElement("td");
    tdId.textContent = request.employeeId;
    row.appendChild(tdId);

    // Employee Name (match employeeId with employees)
    let employee = employees.find((emp) => emp.id === request.employeeId);
    let tdName = document.createElement("td");
    tdName.textContent = employee ? employee.name : "Unknown";
    row.appendChild(tdName);

    // Request Type + Notes
    let tdType = document.createElement("td");
    tdType.innerHTML = `${request.type}<br/><small style='color:grey'>${request.notes}</small>`;
    row.appendChild(tdType);

    // Date
    let tdDate = document.createElement("td");
    tdDate.textContent = request.date;
    row.appendChild(tdDate);

    // Status
    let tdStatus = document.createElement("td");
    let spanStatus = document.createElement("span");
    spanStatus.textContent = request.status;

    if (request.status === "Approved") {
      spanStatus.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
      spanStatus.style.color = "##198754";
    } else if (request.status === "Rejected") {
      spanStatus.style.backgroundColor = "rgba(244, 91, 105, 0.1)";
      spanStatus.style.color = "#f45b69";
    } else if (request.status === "Pending") {
      spanStatus.style.backgroundColor = "rgba(239, 190, 18, 0.1)";
      spanStatus.style.color = "#efbe12";
    }

    spanStatus.style.fontWeight = "bold";
    spanStatus.style.padding = "5px";
    spanStatus.style.borderRadius = "5px";
    tdStatus.appendChild(spanStatus);
    row.appendChild(tdStatus);

    // Action buttons

    // Approve Button
    let approveButton = document.createElement("button");
    approveButton.textContent = "Approve";
    approveButton.classList.add("approve");
    approveButton.style.border = "none";
    approveButton.style.backgroundColor = "#3fc28a";
    approveButton.style.color = "#fff";
    approveButton.style.marginTop = "5px";
    approveButton.style.borderRadius = "5px";
    row.appendChild(approveButton);

    // Approve Button
    let rejectedButton = document.createElement("button");
    rejectedButton.textContent = "Reject";
    rejectedButton.classList.add("reject");
    rejectedButton.style.border = "none";
    rejectedButton.style.backgroundColor = "#f45b69";
    rejectedButton.style.color = "#fff";
    rejectedButton.style.marginTop = "5px";
    rejectedButton.style.marginLeft = "5px";
    rejectedButton.style.borderRadius = "5px";
    row.appendChild(rejectedButton);

    tableBody.appendChild(row);
  });
  addEvents();
}

// add buttons event

function addEvents() {
  let approveButtons = document.querySelectorAll(".approve");
  let rejectButtons = document.querySelectorAll(".reject");

  // Approve
  approveButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      let row = btn.closest("tr");
      let requestId = parseInt(row.dataset.id);

      updateRequestStatus(requestId, "Approved");
      disableRowButtons(row);
    });
  });

  // Reject
  rejectButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      let row = btn.closest("tr");
      let requestId = parseInt(row.dataset.id);

      updateRequestStatus(requestId, "Rejected");
      disableRowButtons(row);
    });
  });
}

function updateRequestStatus(requestId, newStatus) {
  // get requests from localStorage
  let requests = getItem("allRequests") || [];

  // find the request
  let request = requests.find((r) => r.id === requestId);
  if (request) {
    request.status = newStatus;

    // save back to localStorage
    setItem("allRequests", requests);

    // update UI directly
    let row = document.querySelector(`tr[data-id="${requestId}"]`);
    let tdStatus = row.querySelector("td:nth-child(5) span");

    tdStatus.textContent = newStatus;

    if (newStatus === "Approved") {
      tdStatus.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
      tdStatus.style.color = "#3fc28a";
    } else if (newStatus === "Rejected") {
      tdStatus.style.backgroundColor = "rgba(244, 91, 105, 0.1)";
      tdStatus.style.color = "#f45b69";
    } else {
      tdStatus.style.backgroundColor = "rgba(239, 190, 18, 0.1)";
      tdStatus.style.color = "#efbe12";
    }
  }
}

function disableRowButtons(row) {
  let approveBtn = row.querySelector(".approve");
  let rejectBtn = row.querySelector(".reject");

  approveBtn.disabled = true;
  rejectBtn.disabled = true;

  approveBtn.style.opacity = "0.6";
  rejectBtn.style.opacity = "0.6";
  approveBtn.style.cursor = "not-allowed";
  rejectBtn.style.cursor = "not-allowed";
}

// dark mode and logOut
const html = document.documentElement; // <html>
const btn = document.getElementById("toggleTheme");
const logoutIcon = document.querySelector(".logoutIcon");
logoutIcon.addEventListener("click", () => {
  localStorage.removeItem("employee");
  window.location = "../../../index.html";
});
html.setAttribute("data-bs-theme", "light");
btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  if (currentTheme === "light") {
    html.setAttribute("data-bs-theme", "dark");
  } else {
    html.setAttribute("data-bs-theme", "light");
  }
});
// dark mode end

fetchedData();

