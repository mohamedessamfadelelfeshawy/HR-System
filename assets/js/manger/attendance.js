import {
  fetchEmployee,
  setItem,
  getItem,
} from "../../../assets/js/exportFun.js";

const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");
const logoutIcon = document.querySelector(".logoutIcon");

async function calculateSalaries() {
  const allEmployees = getItem("allEmployees");
  const settings = getItem("setting system");
  const attendanceRecords = await fetchEmployee("/assets/js/json/attendance-record.json");

  if (!allEmployees || !settings || !attendanceRecords) {
    console.error("error: (allEmployees, setting system, attendanceRecords) ");
    return;
  }

  const updatedEmployees = allEmployees.map(employee => {
    const employeeRecords = attendanceRecords.filter(record => record.employeeId == employee.id);

    let lateCount = 0;
    let absentCount = 0;

    employeeRecords.forEach(record => {
      if (record.status === "Late") {
        lateCount++;
      } else if (record.status === "Absent") {
        absentCount++;
      }
    });

    const dailyRate = (employee.monthlySalary || 0) / 30;

    const lateDeductionAmount = (dailyRate * ((settings.late || 0) / 100)) * lateCount;
    const absentDeductionAmount = (dailyRate * ((settings.absent || 0) / 100)) * absentCount;
    const totalPenalties = lateDeductionAmount + absentDeductionAmount;

    let bonusAmount = 0;
    if (lateCount === 0 && absentCount === 0 && (settings.bonus || 0) > 0) {
      bonusAmount = (employee.monthlySalary || 0) * ((settings.bonus || 0) / 100);
    }

    const newNetSalary = (employee.monthlySalary || 0) - totalPenalties + bonusAmount;

    // تم تعديل السطر التالي ليتوافق مع ملف JSON
    return {
      ...employee,
      Penalties: totalPenalties.toFixed(2),
      NetSalary: newNetSalary.toFixed(2), 
    };
  });
  setItem("allEmployees", updatedEmployees);
}

logoutIcon.addEventListener("click", () => {
  localStorage.removeItem("employee");
  window.location.replace("../../../index.html"); // تم استخدام .replace لمنع الرجوع للخلف
});

function displayData(arr) {
  let emp = "";
  if (!arr) return;
  arr.map((el) => {
    emp += `
      <tr>
          <td>${el.employeeId}</td>
          <td>${el.employeeName}</td>
          <td>${el.date}</td>
          <td>${el.checkIn}</td>
          <td>${el.checkOut}</td>
          <td>
            <span class="px-2 py-1 special-status rounded ${el.status === "Present" ? "bg-success" : el.status === "Absent" ? "bg-danger" : "bg-warning"
      }">${el.status}</span>
          </td>
      </tr>`;
  });
  tBody.innerHTML = emp;
}


search.addEventListener("input", (e) => {
  e.preventDefault();
  if (window.attendants) {
    let arrFilter = window.attendants.filter((el) =>
      el.status.toLowerCase().includes(search.value.toLowerCase())
    );
    displayData(arrFilter);
  }
});

const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-bs-theme", savedTheme);

btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});
(async () => {

  window.attendants = await fetchEmployee("/assets/js/json/attendance-record.json");
  displayData(window.attendants);

  await calculateSalaries();
})();