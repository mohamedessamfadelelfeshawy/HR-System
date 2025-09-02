import {
  fetchEmployee,
  getItem,
  setItem,
} from "../../../assets/js/exportFun.js";

// fetch or load from localStorage
async function fetchedData() {
  try {
    let allRequests = getItem("allRequests");

    if (!allRequests) {
      allRequests = await fetchEmployee(
        "../../../assets/js/json/requests.json"
      );
      setItem("allRequests", allRequests);
    }

    let empData = getItem("employee");
    if (!empData) {
      console.error("No employee is logged in.");
      return [];
    }

    let empRequest = allRequests.filter(
      (record) => record.employeeId == empData.id
    );

    // Render table
    createTable(empRequest);
    return empRequest;
  } catch (error) {
    console.error("Error fetching requests data:", error);
    return [];
  }
}

function createTable(Request) {
  let table = document.querySelector("#request-table");
  table.innerHTML = "";

  // Table Header
  let tableHeader = document.createElement("thead");
  let tableHeadRow = document.createElement("tr");
  tableHeadRow.classList.add("text-nowrap", "text-center");

  ["ID", "Request", "Status", "Date"].forEach((text) => {
    let tableHead = document.createElement("th");
    tableHead.textContent = text;
    tableHeadRow.appendChild(tableHead);
  });

  tableHeader.appendChild(tableHeadRow);
  table.appendChild(tableHeader);

  // Table Body
  let tableBody = document.createElement("tbody");
  tableBody.classList.add("text-center");
  table.appendChild(tableBody);

  Request.forEach((request) => {
    let tableBodyRow = document.createElement("tr");
    tableBodyRow.classList.add("text-nowrap");
    tableBodyRow.dataset.id = request.id;

    // ID
    let tdId = document.createElement("td");
    tdId.textContent = request.employeeId;
    tableBodyRow.appendChild(tdId);

    // Request
    let tdTask = document.createElement("td");
    tdTask.innerHTML = `${request.type}<br/><small>${request.notes}</small>`;
    tableBodyRow.appendChild(tdTask);

    // Status
    let tdStatus = document.createElement("td");
    let spanStatus = document.createElement("span");
    spanStatus.textContent = request.status;

    if (request.status === "Approved") {
      spanStatus.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
      spanStatus.style.color = "#3fc28a";
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
    tableBodyRow.appendChild(tdStatus);

    // Date
    let tdDate = document.createElement("td");
    tdDate.textContent = request.date;
    tableBodyRow.appendChild(tdDate);

    tableBody.appendChild(tableBodyRow);
  });
}

// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  let currentRequests = [];

  fetchedData().then((data) => {
    currentRequests = data;
  });

  let makeReqBtn = document.querySelector(".req-btn");
  let idSpan = document.querySelector("#sele");
  let empData = getItem("employee");

  makeReqBtn.addEventListener("click", () => {
    if (empData) {
      idSpan.textContent = empData.id;
    }
  });

  let form = document.querySelector("#form-container form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let type = document.querySelector("#sel").value;
    let notes = document.querySelector("#reason").value;
    let date = document.querySelector("#intial").value;

    if (type === "reason" || !date) {
      alert("Please select type and date.");
      return;
    }

    // get allRequests from localStorage
    let allRequests = getItem("allRequests") || [];

    let newId = allRequests.length
      ? allRequests[allRequests.length - 1].id + 1
      : 1;

    let newRequest = {
      id: newId,
      employeeId: empData.id,
      type: type,
      notes: notes,
      date: date,
      status: "Pending",
    };

    // push into allRequests and employeeRequest
    allRequests.push(newRequest);
    currentRequests.push(newRequest);

    // save both to localStorage
    setItem("allRequests", allRequests);

    // update table
    createTable(currentRequests);

    let modal = bootstrap.Modal.getInstance(
      document.getElementById("exampleModal")
    );
    modal.hide();

    form.reset();
  });
});

// logout
let logoutButton = document.querySelector("#logbtn");
logoutButton.addEventListener("click", (e) => {
  window.open("../../../index.html");
});

// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
  if (savedTheme === "dark") {
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-bs-theme", newTheme);

    if (newTheme === "dark") {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon");
    }

    localStorage.setItem("theme", newTheme);
  });
});
