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

function findIdealEmployees() {
  const allEmployees = getItem("allEmployees") || [];
  const allTasks = getItem("allTasks") || [];

  if (allEmployees.length === 0) {
    return [];
  }

  const excludedRoles = ["hr", "manager", "security"];
  const eligibleEmployees = allEmployees.filter((employee) => {
    return (
      employee.role && !excludedRoles.includes(employee.role.toLowerCase())
    );
  });

  const employeesWithTaskScores = eligibleEmployees.map((employee) => {
    const employeeTasks = allTasks.filter(
      (task) => task.employeeId == employee.id
    );
    const completedTasksCount = employeeTasks.filter(
      (task) => task.status === "Done"
    ).length;

    return {
      ...employee,
      completedTasks: completedTasksCount,
    };
  });

  employeesWithTaskScores.sort((a, b) => {
    if (b.completedTasks !== a.completedTasks) {
      return b.completedTasks - a.completedTasks;
    }

    return Number(a.Penalties) - Number(b.Penalties);
  });

  return employeesWithTaskScores;
}

function displayIdealEmployees() {
  const idealEmployees = findIdealEmployees();

  if (idealEmployees.length === 0) {
    idealEmployeeList.innerHTML = `
      <li class="list-group-item shadow-sm border-0 rounded-3 p-3 text-center">
        <span class="text-muted">No eligible employees found for the ideal employee award.</span>
      </li>
    `;
    return;
  }

  const topEmployees = idealEmployees.slice(0, 3);

  idealEmployeeList.innerHTML = topEmployees
    .map((emp, index) => {
      const isBestEmployee = index === 0;
      const highlightClass = isBestEmployee ? "highlighted-employee" : "";
      const starIcon = isBestEmployee
        ? '<i class="fa-solid fa-star text-warning fs-5 me-2"></i>'
        : '<i class="fa-solid fa-medal text-muted fs-5 me-2"></i>';

      return `
      <li class="list-group-item shadow-sm border-0 rounded-3 mb-3 p-3 d-flex flex-column align-items-center text-center ${highlightClass}">
        <div class="mb-2">
          ${starIcon}
          <span class="fw-bold fs-6">${emp.name}</span>
        </div>
        <span class="badge bg-primary mb-2">${emp.department}</span>
        
        <div class="d-flex flex-wrap justify-content-center gap-2 mt-2">
          <span class="badge bg-success">Completed Tasks: ${emp.completedTasks}</span>
          <span class="badge bg-danger">Penalties: ${emp.Penalties}</span>
          <span class="badge bg-dark">Net Salary: ${emp.NetSalary}</span>
        </div>
      </li>
    `;
    })
    .join("");
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
