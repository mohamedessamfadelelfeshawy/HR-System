import { fetchEmployee } from "../../../assets/js/exportFun.js";
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");

const employeeTable = document.getElementById('employeeTable');
const saveEmployeeBtn = document.getElementById('saveEmployee');



//let employees=await fetchEmployee("/assets/js/json/employee.json");






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
