import { fetchEmployee, setItem, getItem } from "../../../assets/js/exportFun.js";
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const numEmployee = document.getElementById("numEmployee");
const numTasks = document.getElementById("numTasks");
const numRequests = document.getElementById("numRequests");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");
const logoutIcon = document.querySelector(".logoutIcon");



/* employee */
let employees = await fetchEmployee("/assets/js/json/employee.json");
numEmployee.innerHTML = employees.length;
displayData(employees);

/* tasks */
let localTasks = getItem("allTasks");
numTasks.innerHTML = localTasks?localTasks.length:15;

/* requests */
let requests = await fetchEmployee("/assets/js/json/requests.json");
numRequests.innerHTML = requests.length;

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
  let arrFilter = employees.filter(el => el.name.toLowerCase().includes(search.value.toLowerCase()));
  displayData(arrFilter);
})


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

/* logOut */
logoutIcon.addEventListener("click",()=>{
  localStorage.removeItem("employee");
  window.location="../../../index.html"
})

