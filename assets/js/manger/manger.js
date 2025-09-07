import { fetchEmployee, setItem, getItem } from "../../../assets/js/exportFun.js";

// --- عناصر DOM ---
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const numEmployee = document.getElementById("numEmployee");
const numTasks = document.getElementById("numTasks");
const numRequests = document.getElementById("numRequests");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");
const logoutIcon = document.querySelector(".logoutIcon");
const paginationWrapper = document.getElementById("pagination-wrapper");

let allEmployeesData = [];
let currentFilteredData = [];
let currentPage = 1;
const rowsPerPage = 10;


// --- دوال العرض والتنقل (Pagination) ---

function displayPageOfData(items) {
  let tableRows = "";
  if (!items || items.length === 0) {
    tBody.innerHTML = `<tr><td colspan="4" class="text-center">No matching employees found</td></tr>`;
    return;
  }
  
  items.forEach(el => {
    tableRows += `
      <tr>
          <td>${el.id}</td>
          <td>${el.name}</td>
          <td>${el.department}</td>
          <td>${el.role}</td>
      </tr>`;
  });
  tBody.innerHTML = tableRows;
}

function setupPaginationControls() {
  paginationWrapper.innerHTML = "";
  const pageCount = Math.ceil(currentFilteredData.length / rowsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    if (i === currentPage) li.classList.add("active");

    const a = document.createElement("a");
    a.classList.add("page-link");
    a.href = "#";
    a.innerText = i;
    li.appendChild(a);

    a.addEventListener("click", (e) => {
      e.preventDefault();
      renderPage(i);
    });
    
    paginationWrapper.appendChild(li);
  }
}

function renderPage(pageNumber) {
  currentPage = pageNumber;
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = currentFilteredData.slice(start, end);
  
  displayPageOfData(paginatedItems);
  
  document.querySelectorAll(".page-item").forEach(item => {
    item.classList.remove("active");
    if (parseInt(item.querySelector('.page-link').innerText) === currentPage) {
      item.classList.add("active");
    }
  });
}


// --- ربط الأحداث والمنطق ---

search.addEventListener("input", () => {
  const searchTerm = search.value.toLowerCase().trim();
  
  if (searchTerm === "") {
    currentFilteredData = [...allEmployeesData];
  } else {
    currentFilteredData = allEmployeesData.filter(el => 
      el.name.toLowerCase().includes(searchTerm)
    );
  }
  
  setupPaginationControls();
  renderPage(1); // Always go to the first page of results
});

logoutIcon.addEventListener("click", () => {
  localStorage.removeItem("employee");
  window.location = "../../../index.html";
});

const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-bs-theme", savedTheme);
btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});


// --- التشغيل الأولي ---
(async () => {
  // Fetch main data
  allEmployeesData = await fetchEmployee("/assets/js/json/employee.json");
  currentFilteredData = [...allEmployeesData];
  numEmployee.innerHTML = allEmployeesData.length;

  // Fetch stats
  const localTasks = getItem("allTasks");
  numTasks.innerHTML = localTasks ? localTasks.length : 15;
  const localRequest = getItem("allRequests");
  numRequests.innerHTML = localRequest ? localRequest.length : 0;

  // Initial render
  setupPaginationControls();
  renderPage(1);
})();