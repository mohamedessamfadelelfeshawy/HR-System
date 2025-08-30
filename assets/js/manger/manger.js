// pop up start
const employeeTable = document.getElementById('employeeTable');
  const saveEmployeeBtn = document.getElementById('saveEmployee');

  saveEmployeeBtn.addEventListener('click', () => {
    const name = document.getElementById('empName').value;
    const email = document.getElementById('empEmail').value;
    const designation = document.getElementById('empDesignation').value;

    if(name && email && designation){
       
      const row = `<tr><td>${name}</td><td>${email}</td><td>${designation}</td></tr>`;
      employeeTable.insertAdjacentHTML('beforeend', row);

      
      document.getElementById('employeeForm').reset();

      
      const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
      modal.hide();
    }
  });

  // pop up end




  //  Dark Mode start
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;

  
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });
});



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