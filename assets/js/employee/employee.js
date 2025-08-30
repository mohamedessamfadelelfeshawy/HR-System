document.addEventListener("DOMContentLoaded", function () {

  
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const rootElement = document.documentElement;

  // Check saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  rootElement.setAttribute("data-bs-theme", savedTheme);
  updateIcon(savedTheme);

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    const currentTheme = rootElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    rootElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    if (theme === "dark") {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }
});
