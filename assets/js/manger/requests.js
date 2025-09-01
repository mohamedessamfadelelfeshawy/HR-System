// dark mode staart
const html = document.documentElement; // <html>
const btn = document.getElementById("toggleTheme");
const logoutIcon = document.querySelector(".logoutIcon");
/* logOut */
logoutIcon.addEventListener("click",()=>{
  localStorage.removeItem("employee");
  window.location="../../../index.html"
})



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