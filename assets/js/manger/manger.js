import { fetchEmployee } from "../../../assets/js/exportFun.js";
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const numEmployee = document.getElementById("numEmployee");
const numTasks = document.getElementById("numTasks");
const numRequests = document.getElementById("numRequests");
const employeeTable = document.getElementById('employeeTable');
const saveEmployeeBtn = document.getElementById('saveEmployee');



let employees = await fetchEmployee("/assets/js/json/employee.json");
numEmployee.innerHTML = employees.length;

let tasks = await fetchEmployee("/assets/js/json/tasks.json");
localStorage.setItem("allTasks", JSON.stringify(tasks));
let localTasks = JSON.parse(localStorage.getItem("allTasks"));
numTasks.innerHTML = localTasks.length;

let requests = await fetchEmployee("/assets/js/json/requests.json");
numRequests.innerHTML = requests.length;




html.setAttribute("data-bs-theme", "light");
btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  if (currentTheme === "light") {
    html.setAttribute("data-bs-theme", "dark");
  } else {
    html.setAttribute("data-bs-theme", "light");
  }
});




/* // saveEmployeeBtn.addEventListener('click', () => {

//   const name = document.getElementById('empName').value;
//   const email = document.getElementById('empEmail').value;
//   const designation = document.getElementById('empDesignation').value;

//   if (name && email && designation) {

//     const row = `<tr><td>${name}</td><td>${email}</td><td>${designation}</td></tr>`;
//     employeeTable.insertAdjacentHTML('beforeend', row);


//     document.getElementById('employeeForm').reset();


//     const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
//     modal.hide();
//   }
// });

// // pop up end

 */
