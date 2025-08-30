// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
  if (savedTheme === "dark") {
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-bs-theme", newTheme);

    if (newTheme === "dark") {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon");
    }

    localStorage.setItem("theme", newTheme);
  });
});
