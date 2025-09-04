//SELECT DOM ELEMENT
let bodyTable = document.getElementById("bodyTable");
let employeeIdInput = document.getElementById("employeeId");
let employeeNameInput = document.getElementById("employeeName");
let DateInput = document.getElementById("todayDate");
let checkInInput = document.getElementById("checkIn");
let checkOutInput = document.getElementById("checkOut");
let btnAddAttendance = document.getElementById("btnAdd");
const idError = document.getElementById("idError");
const nameError = document.getElementById("nameError");
let searchEmployeeInput = document.getElementById("searchEmployee");
let btnsFilter = document.querySelectorAll('.filter-btn');

let AttendanceRecord = JSON.parse(localStorage.getItem("AttendanceRecord")) || [];


let employeesAttendanceInfo = JSON.parse(
  localStorage.getItem("employeesAttendanceInfo")
) || [];
displayArray(employeesAttendanceInfo);
if (employeesAttendanceInfo.length > 0) {
  displayArray(employeesAttendanceInfo);
} else {
  getUser();
}

// DISPLAY
function displayArray(arr) {
  if (!arr || arr.length === 0) {
    bodyTable.innerHTML = `<tr><td colspan="6">No data available</td></tr>`;
    return;
  }

  let containerInfoAttendance = arr.map((employee) => {
    return `
      <tr>
        <td>${employee.employeeId}</td>
        <td>${employee.employeeName}</td>
        <td>${employee.date}</td>
        <td>${employee.checkIn}</td>
        <td>${employee.checkOut}</td>
        <td>${statusEmployee(employee)}</td>
      </tr>
    `;
  });

  bodyTable.innerHTML = containerInfoAttendance.join("");
}


// STATUS
function statusEmployee(object) {
  if (object.isLeave) {
    object.status = "Leave";
  } else if (object.isWFH) {
    object.status = "WFH";
  } else if (!object.checkIn) {
    object.status = "Absent";
  } else {
    let parts = object.checkIn.split(":");
    let hours = Number(parts[0]);
    let minutes = Number(parts[1]);
    let totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= 9 * 60) {
      object.status = "Present";
    } else if (totalMinutes <= 11 * 60) {
      object.status = "Late";
    } else {
      object.status = "Absent";
    }
  }

  switch (object.status) {
    case "Present":
      return `<button class="btn btn-success btn-sm">Present</button>`;

    case "Late":
      return `<button class="btn btn-warning btn-sm">Late</button>`;

    case "Absent":
      return `<button class="btn btn-danger btn-sm">Absent</button>`;

    case "WFH":
      return `<button class="btn btn-info btn-sm">WFH</button>`;

    case "Leave":
      return `<button class="btn btn-secondary btn-sm">Leave</button>`;

    default:
      return `<button class="btn btn-dark btn-sm">Unknown</button>`;
  }
}


// LOCAL STORAGE
function updateLocalStorage() {
  localStorage.setItem("employeesAttendanceInfo", JSON.stringify(employeesAttendanceInfo));
  localStorage.setItem("AttendanceRecord", JSON.stringify(AttendanceRecord));
}

// RESET INPUTS
function updateInputs() {
  employeeIdInput.value = "";
  employeeNameInput.value = "";
  DateInput.value = "";
  checkInInput.value = "";
  checkOutInput.value = "";
}

// GET DATA FROM JSON
async function getUser() {
  try {
    const res = await fetch(`../assets/js/json/attendance_single_day.json`);
    const data = await res.json();

    employeesAttendanceInfo = [...data];
    updateLocalStorage(employeesAttendanceInfo);
    displayArray(employeesAttendanceInfo);
  } catch (error) {
    console.error("Error fetching default data:", error);
  }
}
async function getAttendanceRecord() {
  try {
    const res = await fetch(`../assets/js/json/attendance-record.json`);
    const data = await res.json();
    AttendanceRecord = [...data];
    console.log(AttendanceRecord);
    
  } catch (error) {
    console.error("Error fetching default data:", error);
  }
}

getAttendanceRecord();

// CREATE EMPLOYEE
function AddEmployee() {
  let employeeId = employeeIdInput.value.trim();
  let employeeName = employeeNameInput.value.toUpperCase().trim();
  let date = DateInput.value;
  let checkIn = checkInInput.value;
  let checkOut = checkOutInput.value;

  if (employeeId && employeeName && date && validateId() && validateName()) {
    let attendance = { employeeId, employeeName, date, checkIn, checkOut };

    statusEmployee(attendance); 

    employeesAttendanceInfo.unshift(attendance);

     updateLocalStorage(employeesAttendanceInfo);

    displayArray(employeesAttendanceInfo);

    updateInputs();

    AttendanceRecord.push(attendance);
      
     updateLocalStorage();
   
      //  console.log(AttendanceRecord);
  } else {
    let errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
    errorModal.show();
  }
}

btnAddAttendance.addEventListener("click", function (e) {
  e.preventDefault();
  AddEmployee();
});

// VALIDATION
function validateId() {
  const value = employeeIdInput.value.trim();
  if (!/^[0-9]+$/.test(value)) {
    idError.innerText = "ID must be numbers only";
    return false;
  } else {
    idError.innerText = "";
    return true;
  }
}

function validateName() {
  const value = employeeNameInput.value.trim();
  if (!/^[a-zA-Z ]+$/.test(value)) {
    nameError.innerText = "Name must contain letters only";
    return false;
  } else {
    nameError.innerText = "";
    return true;
  }
}

employeeIdInput.addEventListener("blur", validateId);
employeeNameInput.addEventListener("blur", validateName);

// SEARCH
function searchEmployeeName() {
  let nameEmployeeSearch = searchEmployeeInput.value.trim().toLowerCase();
  let containerNamesEmployeesFilter = employeesAttendanceInfo.filter(emp =>
    emp.employeeName.toLowerCase().includes(nameEmployeeSearch)
  );
  displayArray(containerNamesEmployeesFilter);
}

searchEmployeeInput.addEventListener('input', searchEmployeeName);

// FILTER
function filteredByStatus(status) {
  let filtered;
  if (status === 'All') {
    filtered = employeesAttendanceInfo;
  } else {
    filtered = employeesAttendanceInfo.filter(employee => employee.status === status);
  }
  displayArray(filtered);
}

btnsFilter.forEach(btn => {
  btn.addEventListener('click', function () {
    let status = btn.getAttribute("data-status");
    filteredByStatus(status);
  });
});

// LOGOUT
document.querySelector('.btn-logout').addEventListener('click', function () {
  localStorage.removeItem("salaries");
  localStorage.removeItem("employeesAttendanceInfo");
  window.location = "../index.html";
});
