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
