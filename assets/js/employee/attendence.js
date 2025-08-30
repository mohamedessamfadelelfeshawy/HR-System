document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  // Check saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-bs-theme", savedTheme);
  themeIcon.classList.toggle("fa-sun", savedTheme === "dark");
  themeIcon.classList.toggle("fa-moon", savedTheme === "light");

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    html.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    themeIcon.classList.toggle("fa-sun", newTheme === "dark");
    themeIcon.classList.toggle("fa-moon", newTheme === "light");
  });
});

function getEmp() {
  let welcomeUser = document.querySelector(".welcome-head");
  let empSpecial = document.querySelector(".emp-spetial");
  let userEmail = document.querySelector(".emp-mail");
  let getData = localStorage.getItem("employee");
  let empData = JSON.parse(getData);
  welcomeUser.innerHTML = `Welcome ${empData.name}`;
  empSpecial.innerHTML = `${empData.department}`;
  userEmail.innerHTML = `${empData.email}`;
}

getEmp();

// calendar

const monthYear = document.getElementById("monthYear");
const calendarBody = document.getElementById("calendar-body");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const selectedInfo = document.getElementById("selected-info");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const today = new Date();
let displayedMonth = today.getMonth();
let displayedYear = today.getFullYear();

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatPretty(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  const mm = months[Number(m) - 1];
  return `${Number(d)} ${mm} ${y}`;
}

function renderCalendar(month, year) {
  monthYear.textContent = `${months[month]} ${year}`;
  calendarBody.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let date = 1;

  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");

      if (i === 0 && j < firstDay) {
        cell.innerHTML = "";
      } else if (date > daysInMonth) {
        cell.innerHTML = "";
      } else {
        const span = document.createElement("span");
        span.className = "day";
        span.textContent = date;

        const ds = `${year}-${pad(month + 1)}-${pad(date)}`;
        span.dataset.date = ds;

        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          span.classList.add("day-today");
          span.classList.add("day-selected");
          selectedInfo.textContent = `Selected: ${formatPretty(ds)}`;
        }

        span.addEventListener("click", function () {
          document
            .querySelectorAll(".calendar-table .day")
            .forEach((d) => d.classList.remove("day-selected"));
          this.classList.add("day-selected");
          selectedInfo.textContent = `Selected: ${formatPretty(
            this.dataset.date
          )}`;
        });

        cell.appendChild(span);
        date++;
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

prevBtn.addEventListener("click", () => {
  displayedMonth--;
  if (displayedMonth < 0) {
    displayedMonth = 11;
    displayedYear--;
  }
  selectedInfo.textContent = "Selected: —";
  renderCalendar(displayedMonth, displayedYear);
});

nextBtn.addEventListener("click", () => {
  displayedMonth++;
  if (displayedMonth > 11) {
    displayedMonth = 0;
    displayedYear++;
  }
  selectedInfo.textContent = "Selected: —";
  renderCalendar(displayedMonth, displayedYear);
});

renderCalendar(displayedMonth, displayedYear);
