// dark mode staart
const html = document.documentElement; 
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
// logout sart
let logOutButton=document.querySelector("#logBtn");
logOutButton.addEventListener("click",(e)=>{
  localStorage.removeItem("employee");
  window.open("../../../index.html");
})
// logout end


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settingsForm");

  
  const savedSettings = JSON.parse(localStorage.getItem("systemSettings")) || {};
  if (savedSettings.overtimeMultiplier) {
    document.getElementById("overtimeMultiplier").value = savedSettings.overtimeMultiplier;
    document.getElementById("deductionCap").value = savedSettings.deductionCap;
    document.getElementById("idealBonus").value = savedSettings.idealBonus;

    
    ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
      .forEach(day => {
        if (savedSettings.workweek?.includes(day)) {
          document.getElementById(day).checked = true;
        } else {
          document.getElementById(day).checked = false;
        }
      });
  }

  
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const settings = {
      overtimeMultiplier: parseFloat(document.getElementById("overtimeMultiplier").value),
      deductionCap: parseFloat(document.getElementById("deductionCap").value),
      idealBonus: parseFloat(document.getElementById("idealBonus").value),
      workweek: []
    };

    
    ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
      .forEach(day => {
        if (document.getElementById(day).checked) {
          settings.workweek.push(day);
        }
      });

    
    localStorage.setItem("systemSettings", JSON.stringify(settings));

    alert(" Settings saved successfully!");
  });
});