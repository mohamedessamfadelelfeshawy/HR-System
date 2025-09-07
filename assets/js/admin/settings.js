// dark mode start
const html = document.documentElement; 
const btn = document.getElementById("toggleTheme");

// Set a default theme if none is saved
if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "light");
}

html.setAttribute("data-bs-theme", localStorage.getItem("theme"));

btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  if (currentTheme === "light") {
    html.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    html.setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", "light");
  }
});
// dark mode end

// logout start
let logOutButton = document.querySelector("#logBtn");
logOutButton.addEventListener("click", (e) => {
  window.location.href = "../../../index.html"; 
});
// logout end


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settingsForm");
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  // Load saved settings from localStorage with the key "setting system"
  const savedSettings = JSON.parse(localStorage.getItem("setting system")) || {};
  
  // Populate the form with saved data if it exists
  if (Object.keys(savedSettings).length > 0) {
    document.getElementById("late").value = savedSettings.late || 10;
    document.getElementById("absent").value = savedSettings.absent || 100;
    document.getElementById("bonus").value = savedSettings.bonus || 5;
    // Load leave value
    document.getElementById("leave").value = savedSettings.leave || 50;

    weekdays.forEach(day => {
        // If savedSettings.workweek exists and includes the day, check the box. Otherwise, uncheck it.
        document.getElementById(day).checked = savedSettings.workweek?.includes(day) ?? false;
    });
  }

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Create a settings object with data from the form
    const settings = {
      late: parseFloat(document.getElementById("late").value),
      absent: parseFloat(document.getElementById("absent").value),
      bonus: parseFloat(document.getElementById("bonus").value),
      // Add leave value to settings object
      leave: parseFloat(document.getElementById("leave").value),
      workweek: []
    };

    // Check which weekdays are selected and add them to the workweek array
    weekdays.forEach(day => {
        if (document.getElementById(day).checked) {
          settings.workweek.push(day);
        }
    });

    // Save the settings object to localStorage with the key "setting system"
    localStorage.setItem("setting system", JSON.stringify(settings));

    alert("Settings saved successfully!");
  });
});