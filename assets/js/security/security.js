import { getItem, setItem } from "../exportFun.js";
const bodyTable = document.getElementById("bodyTable");
const employeeIdInput = document.getElementById("employeeId");
const employeeNameInput = document.getElementById("employeeName");
const DateInput = document.getElementById("todayDate");
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const btnAddAttendance = document.getElementById("btnAdd");
const idError = document.getElementById("idError");
const nameError = document.getElementById("nameError");
const searchEmployeeInput = document.getElementById("searchEmployee");
const btnsFilter = document.querySelectorAll('.filter-btn');
const paginationWrapper = document.getElementById("pagination-wrapper");

let allAttendanceData = [];
let AttendanceRecord = [];
let currentFilteredData = [];
let currentPage = 1;
const rowsPerPage = 10;
let activeFilterStatus = 'All';



function displayPageOfData(items) {
  if (!items || items.length === 0) {
    bodyTable.innerHTML = `<tr><td colspan="6" class="text-center">No matching records found</td></tr>`;
    return;
  }

  const tableRows = items.map((employee) => {

    statusEmployee(employee);
    return `
      <tr>
        <td>${employee.employeeId}</td>
        <td>${employee.employeeName}</td>
        <td>${employee.date}</td>
        <td>${employee.checkIn || '--'}</td>
        <td>${employee.checkOut || '--'}</td>
        <td>${getStatusButton(employee.status)}</td>
      </tr>
    `;
  }).join("");

  bodyTable.innerHTML = tableRows;
}

function setupPaginationControls() {
  paginationWrapper.innerHTML = "";
  const pageCount = Math.ceil(currentFilteredData.length / rowsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    if (i === currentPage) li.classList.add("active");

    const a = document.createElement("a");
    a.classList.add("page-link");
    a.href = "#";
    a.innerText = i;
    li.appendChild(a);

    a.addEventListener("click", (e) => {
      e.preventDefault();
      renderPage(i);
    });

    paginationWrapper.appendChild(li);
  }
}

function renderPage(pageNumber) {
  currentPage = pageNumber;
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = currentFilteredData.slice(start, end);

  displayPageOfData(paginatedItems);

  document.querySelectorAll(".page-item").forEach(item => {
    item.classList.remove("active");
    if (parseInt(item.querySelector('.page-link').innerText) === currentPage) {
      item.classList.add("active");
    }
  });
}

function refreshView() {

  if (activeFilterStatus === 'All') {
    currentFilteredData = [...allAttendanceData];
  } else {
    currentFilteredData = allAttendanceData.filter(emp => emp.status === activeFilterStatus);
  }

  // 2. Apply search filter on top of the status filter
  const searchTerm = searchEmployeeInput.value.toLowerCase().trim();
  if (searchTerm) {
    currentFilteredData = currentFilteredData.filter(emp =>
      emp.employeeName.toLowerCase().includes(searchTerm)
    );
  }

  // 3. Reset to page 1 and render
  currentPage = 1;
  setupPaginationControls();
  renderPage(1);
}
function statusEmployee(object) {
  if (object.isLeave) {
    object.status = "Leave";
  } else if (object.isWFH) {
    object.status = "WFH";
  } else if (!object.checkIn || object.checkIn === '--') {
    object.status = "Absent";
  } else {
    const parts = object.checkIn.split(":");
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= 9 * 60) object.status = "Present";
    else if (totalMinutes <= 11 * 60) object.status = "Late";
    else object.status = "Absent";
  }
}

function getStatusButton(status) {
  switch (status) {
    case "Present": return `<button class="btn btn-success btn-sm">Present</button>`;
    case "Late": return `<button class="btn btn-warning btn-sm">Late</button>`;
    case "Absent": return `<button class="btn btn-danger btn-sm">Absent</button>`;
    case "WFH": return `<button class="btn btn-info btn-sm">WFH</button>`;
    case "Leave": return `<button class="btn btn-secondary btn-sm">Leave</button>`;
    default: return `<button class="btn btn-dark btn-sm">Unknown</button>`;
  }
}
function AddEmployee() {
  if (validateId() && validateName() && employeeIdInput.value && employeeNameInput.value && DateInput.value) {
    const newAttendance = {
      employeeId: employeeIdInput.value.trim(),
      employeeName: employeeNameInput.value.toUpperCase().trim(),
      date: DateInput.value,
      checkIn: checkInInput.value,
      checkOut: checkOutInput.value,
    };
    statusEmployee(newAttendance);
    allAttendanceData.unshift(newAttendance);
    AttendanceRecord.unshift(newAttendance);
    updateLocalStorage();
    updateInputs();
    searchEmployeeInput.value = '';
    activeFilterStatus = 'All';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-status="All"]').classList.add('active');
    refreshView();
    localStorage.setItem("attendanceManager", JSON.stringify([...AttendanceRecord]));
  } else {
    new bootstrap.Modal(document.getElementById("errorModal")).show();
  }
}




async function fetchInitialData(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function updateLocalStorage() {
  localStorage.setItem("employeesAttendanceInfo", JSON.stringify(allAttendanceData));
  localStorage.setItem("AttendanceRecord", JSON.stringify(AttendanceRecord));

}

function updateInputs() {
  employeeIdInput.value = "";
  employeeNameInput.value = "";
  DateInput.value = "";
  checkInInput.value = "";
  checkOutInput.value = "";
}

function validateId() {
  const value = employeeIdInput.value.trim();
  const isValid = /^[0-9]+$/.test(value);
  idError.innerText = isValid ? "" : "ID must be numbers only";
  return isValid;
}

function validateName() {
  const value = employeeNameInput.value.trim();
  const isValid = /^[a-zA-Z ]+$/.test(value);
  nameError.innerText = isValid ? "" : "Name must contain letters only";
  return isValid;
}



btnAddAttendance.addEventListener("click", (e) => {
  e.preventDefault();
  AddEmployee();
});

employeeIdInput.addEventListener("blur", validateId);
employeeNameInput.addEventListener("blur", validateName);

searchEmployeeInput.addEventListener('input', refreshView);

btnsFilter.forEach(btn => {
  btn.addEventListener('click', function () {
    btnsFilter.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeFilterStatus = this.getAttribute("data-status");
    refreshView();
  });
});

document.querySelector('.btn-logout').addEventListener('click', function () {
  localStorage.removeItem("salaries");
  window.location = "../index.html";
});

(async () => {
  // Load main data
  let initialData = JSON.parse(localStorage.getItem("employeesAttendanceInfo")) || [];
  if (initialData.length === 0) {
    initialData = await fetchInitialData('../assets/js/json/attendance_single_day.json');
  }
  allAttendanceData = initialData;
  // Ensure all items have a status calculated initially
  allAttendanceData.forEach(emp => statusEmployee(emp));

  // Load secondary record
  let recordData = JSON.parse(localStorage.getItem("AttendanceRecord")) || [];
  if (recordData.length === 0) {
    recordData = await fetchInitialData('../assets/js/json/attendance-record.json');
  }
  AttendanceRecord = recordData;

  updateLocalStorage();

  // Initial render
  document.querySelector('.filter-btn[data-status="All"]').classList.add('active');
  refreshView();
})();
