import { getItem } from "../exportFun";

// dark mode staart
const html = document.documentElement; 
const btn = document.getElementById("toggleTheme");


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
// logout sart
let logOutButton=document.querySelector("#logBtn");
logOutButton.addEventListener("click",(e)=>{
  localStorage.removeItem("employee");
  window.open("../../../index.html");
})



// display ideal employees
// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const [employees, attendance, tasks] = await Promise.all([
//       fetch("/assets/js/json/employee.json").then(res => res.json()),
//       fetch("/assets/js/json/attendance-record.json").then(res => res.json()),
//       fetch("/assets/js/json/tasks.json").then(res => res.json())
//     ]);

//     const today = new Date();
//     const eligibleEmployees = [];

let employees = getItem("allEmployees");
    employees.forEach(emp => {
      const empAttendance = attendance.filter(a => a.employeeId === emp.id);
      const empTasks = tasks.filter(t => t.employeeId === emp.id);

      
      const hasLate = empAttendance.some(a => a.status === "Present" && a.minutesLate > 0);
      const hasMissedDeadline = empTasks.some(
        t => (t.status !== "Completed") && new Date(t.dueDate) < today
      );
      const hasPermission = empAttendance.some(a => a.isPermission === true);

      if (!hasLate && !hasMissedDeadline && !hasPermission) {
        const totalTasks = empTasks.length;
        const completedOnTime = empTasks.filter(
          t => t.status === "Completed" && new Date(t.dueDate) >= new Date(t.completedAt || t.dueDate)
        ).length;

        const onTimeRate = totalTasks > 0 ? (completedOnTime / totalTasks) : 0;

        eligibleEmployees.push({
          id: emp.id,
          name: emp.name,
          department: emp.department,
          monthlySalary: emp.monthlySalary,
          bonus: emp.monthlySalary * 0.1,
          onTimeRate,
          permissionsCount: empAttendance.filter(a => a.isPermission).length
        });
      }
    });

    
    eligibleEmployees.sort((a, b) => {
      if (b.onTimeRate !== a.onTimeRate) return b.onTimeRate - a.onTimeRate;
      if (a.permissionsCount !== b.permissionsCount) return a.permissionsCount - b.permissionsCount;
      return 0;
    });

    
    const topThree = eligibleEmployees.slice(0, 3);

    const list = document.getElementById("idealEmployeeList");
    list.innerHTML = "";

    if (topThree.length > 0) {
      
      const awarded = topThree[0];
      list.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center highlighted-employee">
          <div>
            <i class="fa-solid fa-star text-warning me-2"></i>
            <span class="fw-bold">${awarded.name}</span>
            <small class="d-block text-muted">Dept: ${awarded.department}</small>
            <small class="d-block text-muted">Bonus: $${awarded.bonus}</small>
            <small class="d-block text-success">🌟 Ideal Employee</small>
          </div>
          <span class="badge bg-success">Awarded</span>
        </li>
      `;

      
      topThree.slice(1).forEach(emp => {
        list.innerHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <span class="fw-bold">${emp.name}</span>
              <small class="d-block text-muted">Eligible for this month</small>
            </div>
            <button class="btn btn-sm btn-outline-warning">
              <i class="fa-solid fa-star me-1"></i> Highlight as Ideal
            </button>
          </li>
        `;
      });
    } else {
      list.innerHTML = `<li class="list-group-item text-center text-muted">No eligible employees this month</li>`;
    }

//   } catch (error) {
//     console.error("Error loading data:", error);
//   }
// });
