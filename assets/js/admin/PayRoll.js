import { fetchEmployee, setItem, getItem } from "../../../assets/js/exportFun.js";

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

// Export btn Exel 2
  document.getElementById("payExel").addEventListener("click", function () {
    
    var table = document.getElementById("payTable");

    
    var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    
    XLSX.writeFile(wb, "data.xlsx");
  });


  document.getElementById("payPdfBtn").addEventListener("click", function () {
  var { jsPDF } = window.jspdf; 
  var doc = new jsPDF();

  
  doc.autoTable({ html: "#payTable" });


  doc.save("data.pdf");
});



// display employee payroll in table
// fetch("/assets/js/json/payrolls.json")
//   .then(response => response.json())
//   .then(data => {
  let data=getItem("allEmployees");
    const tbody = document.getElementById("payrollBody");
    tbody.innerHTML = ""; 

    data.forEach(item => {
      


      const row = `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td> 
          <td>${item.email}</td> 
          <td>${item.role}</td>
          <td>${item.monthlySalary}</td> 
        
          
          
         <td>${item.Penalties}</td>

          <td>${item.NetSalary}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  // })
  // .catch(err => console.error("Error loading payroll:", err));




  

