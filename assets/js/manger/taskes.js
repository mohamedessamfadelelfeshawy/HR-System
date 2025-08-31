import { fetchEmployee, setItem, getItem } from "../../../assets/js/exportFun.js";
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");
const employeeTable = document.getElementById('employeeTable');
const saveEmployeeBtn = document.getElementById('saveEmployee');



/* tasks */
let tasks = await fetchEmployee("/assets/js/json/tasks.json");
setItem("allTasks", tasks);
let localTasks = getItem("allTasks");



/* DISPLAY EMPLOYEE */
function displayData(arr) {
  let emp = "";
  arr.map(el => {
    emp += `   <tr>
              <td>${el.id}</td>
              <td>${el.name}</td>
              <td>${el.department}</td>
              <td>${el.role}</td>
            </tr>`
  })
  tBody.innerHTML = emp;
}

/* search */
search.addEventListener("input", (e) => {
  e.preventDefault();
  let arrFilter = tasks.filter(el => el.name.toLowerCase().includes(search.value.toLowerCase()));
  displayData(arrFilter);
})





//let employees=await fetchEmployee("/assets/js/json/employee.json");


/* dark mode */
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
