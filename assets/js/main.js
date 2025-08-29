/// <reference types="../@types/jquery" />
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");

btn.addEventListener("click", () => {
  if (html.getAttribute("data-bs-theme") === "dark") {
    html.setAttribute("data-bs-theme", "light");
         btn.style.color="#183153";
   

  } else {
    html.setAttribute("data-bs-theme", "dark");
        btn.style.color="white";

  }
});