import {
  fetchEmployee,
  setItem,
  getItem,
} from "../../../assets/js/exportFun.js";
const html = document.documentElement; // <html>
const btn = document.getElementById("toggleTheme");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");

/* attendance */
let attendants = getItem("employeesAttendanceInfo");
displayData(attendants);

/* DISPLAY EMPLOYEE */
function displayData(arr) {
  let emp = "";
  arr.map((el) => {
    emp += `
      <tr>
          <td>${el.employeeId}</td>
          <td>${el.employeeName}</td>
          <td>${el.date}</td>
          <td>${el.checkIn}</td>
          <td>${el.checkOut}</td>
        <td>
        <span class="px-2 py-1 special-status rounded ${
          el.status === "Present"
            ? "bg-success"
            : el.status === "Absent"
            ? "bg-danger"
            : "bg-warning"
        }">${el.status}</span>
      </td>


            </tr>`;
  });
  tBody.innerHTML = emp;
}

/* search */
search.addEventListener("input", (e) => {
  e.preventDefault();
  let arrFilter = attendants.filter((el) =>
    el.status.toLowerCase().includes(search.value.toLowerCase())
  );
  displayData(arrFilter);
});

// dark mode end
html.setAttribute("data-bs-theme", "light");
btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  if (currentTheme === "light") {
    html.setAttribute("data-bs-theme", "dark");
  } else {
    html.setAttribute("data-bs-theme", "light");
  }
});
