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
  window.open("../../../index.html");
})
// logout end

// Export btn Exel 2
  document.getElementById("payExel").addEventListener("click", function () {
    
    var table = document.getElementById("payTable");

    
    var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    
    XLSX.writeFile(wb, "data.xlsx");
  });

  // Export btn cv 1
    document.getElementById("payCsvBtn").addEventListener("click", function () {
    var table = document.getElementById("payTable");

    if (table) {
      
      var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

      
      XLSX.writeFile(wb, "data.csv", { bookType: "csv" });
    } else {
      alert(" data is not exist");
    }
  });


// display employee payroll in table
fetch("/assets/js/json/payrolls.json")
  .then(response => response.json())
  .then(data => {
    const tbody = document.getElementById("payrollBody");
    tbody.innerHTML = ""; 

    data.forEach(item => {
      
      const monthFormatted = item.month.split("-").reverse().join("-");

      const row = `
        <tr>
          <td>${item.employeeId}</td>
          <td>${item.name}</td> 
          <td>${monthFormatted}</td>
          <td>${item.baseSalary}</td>
          <td>${item.deductions}</td>
          <td>${item.bonus}</td>
          <td>${item.penalties}</td> 
          <td>${item.netSalary}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  })
  .catch(err => console.error("Error loading payroll:", err));




  

// // جلب وتخزين البيانات لو مش موجودة
// async function initData() {
//   let employees = getItem("employees");
//   if (!employees) {
//     employees = await fetchEmployee("/assets/js/json/employees.json");
//     setItem("employees", employees);
//   }

//   let payrolls = getItem("payrolls");
//   if (!payrolls) {
//     payrolls = await fetchEmployee("/assets/js/json/payrolls.json");
//     setItem("payrolls", payrolls);
//   }

//   return { employees, payrolls };
// }

// // تحديث بيانات الرواتب في localStorage
// function updatePayroll(newPayroll) {
//   setItem("payrolls", newPayroll);
//   renderPayroll(newPayroll);
// }

// // تحديث بيانات الموظفين في localStorage
// function updateEmployees(newEmployees) {
//   setItem("employees", newEmployees);
// }

// // عرض بيانات الرواتب في الجدول
// function renderPayroll(payrolls) {
//   const employees = getItem("employees") || [];
//   const employeesMap = {};
//   employees.forEach(emp => {
//     employeesMap[emp.id] = emp.name;
//   });

//   const tbody = document.getElementById("payrollBody");
//   tbody.innerHTML = "";

//   payrolls.forEach(item => {
//     const monthFormatted = item.month.split("-").reverse().join("-");
//     const employeeName = employeesMap[item.employeeId] || "Unknown";

//     const row = `
//       <tr>
//         <td>${item.employeeId}</td>
//         <td>${employeeName}</td>
//         <td>${monthFormatted}</td>
//         <td>${item.baseSalary}</td>
//         <td>${item.deductions}</td>
//         <td>${item.bonus}</td>
//         <td>${item.penalties}</td> 
//         <td>${item.netSalary}</td>
//       </tr>
//     `;
//     tbody.innerHTML += row;
//   });
// }

// // تحميل البيانات وعرضها أول مرة
// document.addEventListener("DOMContentLoaded", async () => {
//   const { payrolls } = await initData();
//   renderPayroll(payrolls);
// });