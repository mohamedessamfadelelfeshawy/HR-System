import {
  fetchEmployee,
  setItem,
  getItem,
} from "../../../assets/js/exportFun.js";

const html = document.documentElement;
const themeToggleButton = document.getElementById("toggleTheme");
const logOutButton = document.getElementById("logBtn");

html.setAttribute("data-bs-theme", "light");

themeToggleButton.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-bs-theme", newTheme);
});

logOutButton.addEventListener("click", () => {
  localStorage.removeItem("employee");
  window.open("../../../index.html", "_self");
});

function exportTable(tableId, fileName, format) {
  const table = document.getElementById(tableId);
  if (!table) {
    alert("not exist table");
    return;
  }
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
  XLSX.writeFile(workbook, `${fileName}.${format}`, { bookType: format });
}

document
  .getElementById("exportBtn")
  .addEventListener("click", () => exportTable("dataTable", "data", "xlsx"));
document
  .getElementById("dataBtn2")
  .addEventListener("click", () => exportTable("takiTable", "data", "xlsx"));
document
  .getElementById("exportCsvBtn")
  .addEventListener("click", () => exportTable("dataTable", "data", "csv"));
document
  .getElementById("exportCsvBtn2")
  .addEventListener("click", () => exportTable("takiTable", "data", "csv"));

fetch("/assets/js/json/attendance-record.json")
  .then((response) => response.json())
  .then((records) => {
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let wfhCount = 0;

    records.forEach((record) => {
      if (record.status === "Present") {
        presentCount++;
      } else if (record.status === "Absent") {
        absentCount++;
      } else if (record.status === "Late") {
        lateCount++;
      }

      if (record.isWFH === true) {
        wfhCount++;
      }
    });

    document.getElementById("totalPresent").textContent = presentCount;
    document.getElementById("totalLate").textContent = lateCount;
    document.getElementById("totalAbsent").textContent = absentCount;
    document.getElementById("totalWFH").textContent = wfhCount;
  })
  .catch((error) =>
    console.error("Error loading attendance data for cards:", error)
  );

fetch("/assets/js/json/personalTasks.json")
  .then((response) => response.json())
  .then((tasks) => {
    let completed = 0;
    let overdue = 0;

    tasks.forEach((task) => {
      if (task.status === "Completed") {
        completed++;
      } else {
        overdue++;
      }
    });

    document.getElementById("completedCount").textContent = completed;
    document.getElementById("overdueCount").textContent = overdue;
  })
  .catch((error) =>
    console.error("Error loading tasks data for cards:", error)
  );

fetch("/assets/js/json/payrolls.json")
  .then((response) => response.json())
  .then((payrolls) => {
    const totalPayroll = payrolls.reduce(
      (sum, current) => sum + current.netSalary,
      0
    );

    const payrollImpactElement = document.getElementById("payrollImpactValue");
    if (payrollImpactElement) {
      payrollImpactElement.textContent = `$${totalPayroll.toLocaleString()}`;
    }
  })
  .catch((error) => console.error("Error loading payroll data:", error));

fetch("/assets/js/json/attendance-record.json")
  .then((response) => response.json())
  .then((records) => {
    const employeeStats = {};

    records.forEach((rec) => {
      const empId = rec.employeeId;

      if (!employeeStats[empId]) {
        employeeStats[empId] = {
          name: rec.employeeName,
          department: rec.department,
          present: 0,
          late: 0,
          absent: 0,
          wfh: 0,
          penalties: 0,
        };
      }

      if (rec.status === "Present") {
        employeeStats[empId].present++;
      } else if (rec.status === "Late") {
        employeeStats[empId].late++;
        employeeStats[empId].penalties += rec.minutesLate * 2 || 50;
      } else if (rec.status === "Absent") {
        employeeStats[empId].absent++;
        employeeStats[empId].penalties += 100;
      }

      if (rec.isWFH === true) {
        employeeStats[empId].wfh++;
      }
    });

    const tableBody = document.getElementById("reportTableBody");
    tableBody.innerHTML = "";

    Object.values(employeeStats).forEach((emp) => {
      const row = `
        <tr>
          <td>${emp.name}</td>
          <td>${emp.department}</td>
          <td>${emp.present}</td>
          <td>${emp.late}</td>
          <td>${emp.absent}</td>
          <td>${emp.wfh}</td>
          <td>$${emp.penalties.toFixed(2)}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  })
  .catch((error) =>
    console.error("Error loading and processing attendance report:", error)
  );
