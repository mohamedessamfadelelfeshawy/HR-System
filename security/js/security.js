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

// console.log(btnPresent);


// console.log(btnAdd);

// console.log(bodyTable,employeeIdInput,employeeNameInput,DateInput,checkOutInput,checkOutInput);

let employeesAttendanceInfo = JSON.parse(
  localStorage.getItem("employeesAttendanceInfo")
) || [];

if (employeesAttendanceInfo.length > 0) {
  displayArray(employeesAttendanceInfo);
} else {
  getUser();
}
function displayArray(arr) {
    if (!arr || arr.length === 0) {
    bodyTable.innerHTML = `<tr><td colspan="6">No data available</td></tr>`;
    return;
    }

  containerInfoAttendance = arr.map((employee) => {
    // console.log(employee);

    return ` <tr>
          <td>${employee.employeeId}</td>
          <td>${employee.employeeName}</td>
          <td>${employee.date}</td>
          <td>${employee.checkIn}</td>
          <td>${employee.checkOut}</td>
          <td> ${statusEmployee(employee)}
          
          </td>
        </tr>

    `;
  });

  bodyTable.innerHTML = containerInfoAttendance.join("");
}
//UPDATE STATUS ATTENDANCE
function statusEmployee(object) {
  if (!object.checkIn) {
    object.status = "Absent";
    return `<span class="badge bg-danger">Absent</span>`;
  }

  let parts = object.checkIn.split(":"); // ["09", "15"]
  let hours = Number(parts[0]); // 9
  let minutes = Number(parts[1]); // 15
  let totalMinutes = hours * 60 + minutes; // (9*60) + 15 = 555 دقيقة

  if (totalMinutes <= 9 * 60) {
    // لو ≤ 9:00
    object.status = "Present";
    return `<span class="badge bg-success">Present</span>`;
  } else if (totalMinutes > 9 * 60 && totalMinutes <= 11 * 60) {
    // لو أكتر من 9:00 وأقل أو يساوي 11:00
    object.status = "Late";
    return `<span class="badge bg-warning text-dark">Late</span>`;
  } else {
    // أي وقت بعد 11:00 → Absent
    object.status = "Absent";
    return `<span class="badge bg-danger">Absent</span>`;
  }
}

//UPDATE LOCAL STORAGE
function updateLocalStorage(data) {
  localStorage.setItem("employeesAttendanceInfo", JSON.stringify(data));
}

//UPDATE INPUTS
function updateInputs() {
  employeeIdInput.value = "";

  employeeNameInput.value = "";

  DateInput.value = "";

  checkInInput.value = "";

  checkOutInput.value = "";
}

//GET DATA FROM attendance_single_day.json FILE
async function getUser() {
  const response = await fetch(`../assets/js/json/attendance_single_day.json`)
    .then((res) => res.json())
    .then(function (data) {
      employeesAttendanceInfo = [...data];

      updateLocalStorage(employeesAttendanceInfo);

      displayArray(employeesAttendanceInfo);
    });
}

//CREATE EMPLOYEE
function AddEmployee() {
  let employeeId = employeeIdInput.value.trim();
  console.log(employeeId);

  let employeeName = employeeNameInput.value.toUpperCase().trim();

  let date = DateInput.value;

  let checkIn = checkInInput.value;

  let checkOut = checkOutInput.value;

  console.log(employeeId, employeeName, date, checkIn, checkOut);

  if (employeeId && employeeName && date && validateId() && validateName() ) {
    let attendance = {
      employeeId,
      employeeName,
      date,
      checkIn,
      checkOut,
    };
    // employeesAttendanceInfo.push(Attendance);
    console.log(attendance);
    statusEmployee(attendance);
    employeesAttendanceInfo.push(attendance);
    updateLocalStorage(employeesAttendanceInfo);
    displayArray(employeesAttendanceInfo);
    updateInputs();
  } else {
    let errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
    errorModal.show();
  }
}

btnAddAttendance.addEventListener("click", function (e) {
  e.preventDefault();
  AddEmployee();
});

//VALIDATE ID
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


//VALIDATE NAME
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

//VALIDATE RUNTIME
employeeIdInput.addEventListener("blur", validateId);
employeeNameInput.addEventListener("blur", validateName);

//SEARCH BY NAME OF EMPLOYEE

function searchEmployeeName() {
  let nameEmployeeSearch = searchEmployeeInput.value.trim().toLowerCase();


  let containerNamesEmployeesFilter = employeesAttendanceInfo.filter(emp => emp.employeeName.toLowerCase().includes(nameEmployeeSearch) );

  // console.log(nameEmployeeSearch);
displayArray(containerNamesEmployeesFilter)
  console.log(containerNamesEmployeesFilter);

  
  
}

searchEmployeeInput.addEventListener('input' , searchEmployeeName  );

//FILTER EVENTS 

function filteredByStatus(status) {
   let  filtered
  if (status === 'All') {
    filtered = employeesAttendanceInfo;
  } else {
    filtered =  employeesAttendanceInfo.filter(employee => employee.status === status );

  }
  displayArray(filtered);
}

btnsFilter.forEach(btn => {
  btn.addEventListener('click', function () {
    let status = btn.getAttribute("data-status");
     filteredByStatus(status);
  })
});


//LOGOUT

document.querySelector('.btn-logout').addEventListener('click', function () {
  localStorage.removeItem("salaries");
  window.location = "../index.html";
})