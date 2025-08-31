// dark mode staart
const html = document.documentElement; // <html>
const btn = document.getElementById("toggleTheme");


html.setAttribute("data-bs-theme", "light");


btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  if (currentTheme === "light") {
    html.setAttribute("data-bs-theme", "dark");
  } else {
    html.setAttribute("data-bs-theme", "light");
  }
});
// dark mode end