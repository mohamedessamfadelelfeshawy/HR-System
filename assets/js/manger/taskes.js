import { fetchEmployee, setItem, getItem } from "../../../assets/js/exportFun.js";
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");
const employeeTable = document.getElementById('employeeTable');
const saveEmployeeBtn = document.getElementById('saveEmployee');



/* tasks */

let tasks =getItem("allTasks")? getItem("allTasks"): await fetchEmployee("/assets/js/json/tasks.json");
setItem("allTasks", tasks);
let localTasks = getItem("allTasks");


displayData(localTasks);
/* DISPLAY EMPLOYEE */
function displayData(arr) {
  let emp = "";
  arr.map((el, idx) => {
    emp += `   <tr>
              <td>${el.id}</td>
              <td>${el.description}</td>
              <td>${el.name}</td>
              <td>${el.dueDate}</td>
                 <td>
        <span class="px-2 py-1 special-status rounded ${el.status === "Pending"
        ? "bg-warning"
        : el.status === "In Progress"
          ? "bg-info"
          : "bg-danger"
      }">${el.status}</span>
      </td>
           <td>
            <button class="btn btn-sm "><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn btn btn-sm  text-danger" data-idx="${idx}"><i class="fa fa-trash" aria-hidden="true"></i></button>
          </td>

            </tr>`
  })
  tBody.innerHTML = emp;

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let idx = e.currentTarget.dataset.idx;
      tasks.splice(idx, 1);
      localTasks.splice(idx, 1);
      setItem("allTasks", localTasks);
      console.log(tasks);
      tasks=localTasks;
      console.log(localTasks);
      displayData(localTasks);
    });
  });
}

/* search */
search.addEventListener("input", (e) => {
  e.preventDefault();
  let arrFilter = tasks.filter(el => el.name.toLowerCase().includes(search.value.toLowerCase()));
  displayData(arrFilter);
})


/* delete task */





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
