// dark mode staart
const html = document.documentElement; // <html>
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
  window.open("../../../index.html");
})
// logout end

// display idael employee
document.addEventListener("DOMContentLoaded", () => {
  fetch("/assets/js/json/payrolls.json")
    .then(response => response.json())
    .then(data => {
      
      let topEmployee = data.reduce((max, emp) => emp.bonus > max.bonus ? emp : max, data[0]);

      
      const list = document.getElementById("idealEmployeeList");
      list.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-center highlighted-employee">
          <div>
            <i class="fa-solid fa-star text-warning me-2"></i>
            <span class="fw-bold">Employee ID: ${topEmployee.employeeId}</span>
            <small class="d-block text-muted">Bonus: ${topEmployee.bonus}</small>
          </div>
          <span class="badge bg-success">Awarded</span>
        </li>
      `;
    })
    .catch(error => console.error("Error loading salaries:", error));
});