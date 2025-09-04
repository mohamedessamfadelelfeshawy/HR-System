import { getItem } from "../../../assets/js/exportFun.js";

const logoutIcon = document.querySelector(".logoutIcon");
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const idealEmployeeList = document.getElementById("idealEmployeeList");

// Logout
logoutIcon.addEventListener("click", () => {
  localStorage.removeItem("employee");
  window.location.replace("../../../index.html");
});

// Get ideal employees (no penalties + has bonus)
function getIdealEmployees() {
  const allEmployees = getItem("allEmployees") || [];
  return allEmployees.filter(emp => Number(emp.Penalties) === 0 && Number(emp.Bonus) > 0);
}

// Display ideal employees in list
// -- تم تعديل هذه الدالة --
function displayIdealEmployees() {
  const employees = getIdealEmployees();

  // إذا لم يتم العثور على موظفين، اعرض البطاقة الافتراضية
  if (employees.length === 0) {
    idealEmployeeList.innerHTML = `
      <li class="list-group-item shadow-sm border-0 rounded-3 mb-3 p-3 d-flex flex-column align-items-center text-center">
        <div class="mb-2">
          <i class="fa-solid fa-star text-muted fs-5 me-2"></i>
          <span class="fw-bold fs-6 text-muted"> Dina Samir</span>
        </div>
        <span class="badge bg-info mb-2">
Marketing
        </span>
        <div class="d-flex gap-2 mt-2">
          <span class="badge bg-success"></span>
          <span class="badge bg-danger">dina10@gmail.com /span>
        </div>
      </li>
    `;
    return; // توقف هنا
  }

  // إذا تم العثور على موظفين، اعرضهم كالمعتاد
  idealEmployeeList.innerHTML = employees.map(emp => `
    <li class="list-group-item shadow-sm border-0 rounded-3 mb-3 p-3 d-flex flex-column align-items-center text-center highlighted-employee">
      <div class="mb-2">
        <i class="fa-solid fa-star text-warning fs-5 me-2"></i>
        <span class="fw-bold fs-6">${emp.name}</span>
      </div>
      <span class="badge bg-primary mb-1">${emp.department}</span>
      <span class="badge bg-secondary mb-1">${emp.email}</span>
      <div class="d-flex gap-2 mt-2">
        <span class="badge bg-success">Bonus: ${emp.Bonus}</span>
        <span class="badge bg-danger">Penalties: ${emp.Penalties}</span>
        <span class="badge bg-dark">Net: ${emp.NetSalary}</span>
      </div>
    </li>
  `).join("");
}

// Theme toggle
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-bs-theme", savedTheme);

btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// Run
displayIdealEmployees();