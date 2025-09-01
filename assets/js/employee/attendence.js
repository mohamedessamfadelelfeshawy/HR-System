import {
  fetchEmployee,
  getItem,
  setItem,
} from "../../../assets/js/exportFun.js";

// get employee data
async function getEmp() {
  try {
    let divContainer = document.querySelector(".text");
    divContainer.classList.add("fade");
    let welcomeUser = document.querySelector(".welcome-head");
    let empSpecial = document.querySelector(".emp-spetial");
    let userEmail = document.querySelector(".emp-mail");
    let getData = getItem("employee");
    welcomeUser.innerHTML = `Welcome ${getData.name}`;
    empSpecial.innerHTML = `${getData.department}`;
    userEmail.innerHTML = `${getData.email}`;
  } catch (error) {
    console.error("Error fetching EmpData:", error);
    return [];
  }
}

// async function getAttendData() {
//   try {
//     let allData = await fetchEmployee(
//       "../../../assets/js/json/attendance-record.json"
//     );
//     let empData = getItem("employee");
//     if (!empData) {
//       console.error("No employee is logged in.");
//       return [];
//     }
//     let empAttendance = allData.filter(
//       (record) => record.employeeId === empData.id
//     );
//     setItem("allAttendance", empAttendance);
//     createTable(empAttendance);
// cardData(empAttendance);
// renderCalendar(displayedMonth, displayedYear);
//     return empAttendance;
//   } catch (error) {
//     console.error("Error fetching attendance data:", error);
//     return [];
//   }
// }

// get Employee Attendance From Security
async function getSingleAttendance() {
  try {
    let allData = await fetchEmployee(
      "../../../assets/js/json/attendance_single_day.json"
    );
    let empData = getItem("employee");
    if (!empData) {
      console.error("No employee is logged in.");
      return [];
    }
    let empAttendance = allData.filter(
      (record) => record.employeeId === empData.id
    );
    console.log();
    setItem("employeesAttendanceInfo", empAttendance);

    createTable(empAttendance);
    cardData(empAttendance);
    renderCalendar(displayedMonth, displayedYear);
    return empAttendance;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return [];
  }
}

// create table to show data
function createTable(Atten) {
  let attendanceTable = document.querySelector("#attendance-table");
  attendanceTable.innerHTML = "";
  attendanceTable.classList.add("fade");

  let tableHeader = document.createElement("thead");
  let tableHeadRow = document.createElement("tr");
  tableHeadRow.classList.add("text-nowrap", "text-center");

  let headers = [
    "ID",
    "Emp ID",
    "Date",
    "Check-in",
    "Check-out",
    "Status",
    "Minute Late",
    "Work From Home",
    "Leave",
    "Notes",
  ];

  headers.forEach((text) => {
    let tableHead = document.createElement("th");
    tableHead.textContent = text;
    tableHeadRow.appendChild(tableHead);
  });

  tableHeader.appendChild(tableHeadRow);
  attendanceTable.appendChild(tableHeader);

  let tableBody = document.createElement("tbody");
  tableBody.classList.add("text-center");
  attendanceTable.appendChild(tableBody);

  Atten.forEach((record, index) => {
    let row = document.createElement("tr");

    let rowData = [
      index + 1,
      record.employeeId || "—",
      record.date || "—",
      record.checkIn || "—",
      record.checkOut || "—",
    ];

    rowData.forEach((data) => {
      let cell = document.createElement("td");
      cell.textContent = data;
      row.appendChild(cell);
    });

    // Status
    let statusCell = document.createElement("td");
    let statusSpan = document.createElement("span");
    let statusValue = record.status || "—";
    statusSpan.textContent = statusValue;
    statusSpan.classList.add("p-2", "rounded-1");

    if (statusValue === "present") {
      statusSpan.classList.add("present");
    } else if (statusValue === "Absent") {
      statusSpan.classList.add("Absent");
    } else {
      statusSpan.classList.add(statusValue.toLowerCase().replace(/\s+/g, ""));
    }

    statusCell.appendChild(statusSpan);
    row.appendChild(statusCell);

    // Minute Late
    let lateCell = document.createElement("td");
    lateCell.textContent = record.minutesLate || 0;
    row.appendChild(lateCell);

    // Work From Home
    let wfhCell = document.createElement("td");
    let wfhSpan = document.createElement("span");
    let wfhValue = record.isWFH ? "True" : "False";
    wfhSpan.textContent = wfhValue;
    wfhSpan.classList.add("p-2", "rounded-1", record.isWFH ? "True" : "False");
    wfhCell.appendChild(wfhSpan);
    row.appendChild(wfhCell);

    // Leave
    let leaveCell = document.createElement("td");
    let leaveSpan = document.createElement("span");
    let leaveValue = record.isLeave ? "True" : "False";
    leaveSpan.textContent = leaveValue;
    leaveSpan.classList.add(
      "p-2",
      "rounded-1",
      record.isLeave ? "True" : "False"
    );
    leaveCell.appendChild(leaveSpan);
    row.appendChild(leaveCell);

    // Notes
    let noteCell = document.createElement("td");
    noteCell.textContent = record.notes || "—";
    row.appendChild(noteCell);

    tableBody.appendChild(row);
  });
}

// calendar
const monthYear = document.getElementById("monthYear");
const calendarBody = document.getElementById("calendar-body");
const prevBtn = document.getElementById("prev");
prevBtn.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
prevBtn.style.color = "#00a2ca";
prevBtn.style.padding = "3px";
prevBtn.style.borderRadius = "5px";

const nextBtn = document.getElementById("next");
nextBtn.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
nextBtn.style.color = "#00a2ca";
nextBtn.style.padding = "3px";
nextBtn.style.borderRadius = "5px";

const selectedInfo = document.getElementById("selected-info");
selectedInfo.style.backgroundColor = "#00a2ca";
selectedInfo.style.color = "#fff";
selectedInfo.style.width = "300px";
selectedInfo.style.margin = "5px auto";
selectedInfo.style.padding = "5px";
selectedInfo.style.borderRadius = "5px";
selectedInfo.className = "text-center";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const today = new Date();
let displayedMonth = today.getMonth();
let displayedYear = today.getFullYear();

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatPretty(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  const mm = months[Number(m) - 1];
  return `${Number(d)} ${mm} ${y}`;
}

// ✅ التعديل: دلوقتي بياخد من employeesAttendanceInfo مش allAttendance
function getAttendanceStatus(dateStr) {
  const attendanceData = getItem("employeesAttendanceInfo") || [];
  const record = attendanceData.find((rec) => rec.date === dateStr);
  if (!record) return "No Record";
  if (record.isLeave) return "Leave";
  if (record.isWFH) return "Work From Home";
  if (record.status === "Absent") return "Absent";
  if (record.status === "Late") return "Late";
  if (record.status === "Present") return "Present";
  return "Unknown";
}

function renderCalendar(month, year) {
  monthYear.textContent = `${months[month]} ${year}`;
  calendarBody.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let date = 1;

  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");

      if (i === 0 && j < firstDay) {
        cell.innerHTML = "";
      } else if (date > daysInMonth) {
        cell.innerHTML = "";
      } else {
        const span = document.createElement("span");
        span.className = "day";
        span.textContent = date;

        const ds = `${year}-${pad(month + 1)}-${pad(date)}`;
        span.dataset.date = ds;

        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          span.classList.add("day-today");
          span.classList.add("day-selected");
          const status = getAttendanceStatus(ds);
          selectedInfo.textContent = `${ds} - ${status}`;
        }

        span.addEventListener("click", function () {
          document
            .querySelectorAll(".calendar-table .day")
            .forEach((d) => d.classList.remove("day-selected"));
          this.classList.add("day-selected");
          const status = getAttendanceStatus(this.dataset.date);
          selectedInfo.textContent = `${this.dataset.date} - ${status}`;
        });

        cell.appendChild(span);
        date++;
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

prevBtn.addEventListener("click", () => {
  displayedMonth--;
  if (displayedMonth < 0) {
    displayedMonth = 11;
    displayedYear--;
  }
  selectedInfo.textContent = "Selected: —";
  renderCalendar(displayedMonth, displayedYear);
});

nextBtn.addEventListener("click", () => {
  displayedMonth++;
  if (displayedMonth > 11) {
    displayedMonth = 0;
    displayedYear++;
  }
  selectedInfo.textContent = "Selected: —";
  renderCalendar(displayedMonth, displayedYear);
});
renderCalendar(displayedMonth, displayedYear);

// card data
function cardData(records) {
  // cards
  let cards = document.querySelectorAll(".data-card");
  if (!Array.isArray(records)) return;

  // counters
  let presentCount = records.filter((r) => r.status === "Present").length;
  let lateCount = records.filter((r) => r.status === "Late").length;
  let absentCount = records.filter((r) => r.status === "Absent").length;
  let wfhCount = records.filter((r) => r.isWFH).length;

  // array for
  const counts = {
    present: presentCount,
    late: lateCount,
    absent: absentCount,
    wfh: wfhCount,
  };
  // bring data from key and put it in h5
  cards.forEach((el) => {
    let key = el.dataset.key;
    if (key && counts[key] !== undefined) {
      el.textContent = counts[key];
    }
  });
}

// dark Mode
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  // Check saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-bs-theme", savedTheme);
  themeIcon.classList.toggle("fa-sun", savedTheme === "dark");
  themeIcon.classList.toggle("fa-moon", savedTheme === "light");

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    html.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    themeIcon.classList.toggle("fa-sun", newTheme === "dark");
    themeIcon.classList.toggle("fa-moon", newTheme === "light");
  });
});

// getAttendData();
getEmp();
getSingleAttendance();
