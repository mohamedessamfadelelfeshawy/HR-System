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
// Export btn Exel 1
  document.getElementById("exportBtn").addEventListener("click", function () {
    
    var table = document.getElementById("dataTable");

    
    var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    
    XLSX.writeFile(wb, "data.xlsx");
  });
// Export btn Exel 2
  document.getElementById("dataBtn2").addEventListener("click", function () {
    
    var table = document.getElementById("takiTable");

    
    var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    
    XLSX.writeFile(wb, "data.xlsx");
  });

  // Export btn cv 1
    document.getElementById("exportCsvBtn").addEventListener("click", function () {
    var table = document.getElementById("dataTable");

    if (table) {
      
      var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

      
      XLSX.writeFile(wb, "data.csv", { bookType: "csv" });
    } else {
      alert(" data is not exist");
    }
  });
    // Export btn cv 2
    document.getElementById("exportCsvBtn2").addEventListener("click", function () {
    var table = document.getElementById("takiTable");

    if (table) {
      
      var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

      
      XLSX.writeFile(wb, "data.csv", { bookType: "csv" });
    } else {
      alert(" data is not exist");
    }
  });

  // employeesAttendanceInfo
// cards to display total
// document.addEventListener("DOMContentLoaded", () => {
//   fetch("/assets/js/json/attendance_single_day.json")
//     .then(response => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then(data => {
  
  let localTasks = getItem("employeesAttendanceInfo") || [];
      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      let wfhCount = 0;
console.log(localTasks);
      localTasks.forEach(record => {
        if (record.status === "Present") {
          presentCount++;
          
        } else if (record.status === "Absent") {
          absentCount++;
        }
        else if (record.status === "Late") {
          lateCount++;
        }
         else if (record.isWFH == true) {
          wfhCount++;
        }
        
      });

      console.log(wfhCount);
      document.getElementById("totalPresent").textContent = presentCount;
      document.getElementById("totalLate").textContent = lateCount;
      document.getElementById("totalAbsent").textContent = absentCount;
      document.getElementById("totalWFH").textContent = wfhCount;



// display tasks complete and overdue
fetch("/assets/js/json/tasks.json")
  .then(response => response.json())
  .then(tasks => {
    let completed = 0;
    let overdue = 0;

    tasks.forEach(task => {
      if (task.status === "Completed") {
        completed++;
      } else {
        overdue++; 
      }
    });

//     async function showCards() {
// try{
// let allData=await fetchEmployee("../../../assets/js/json/attendance-record.json");
// console.log(allData)
// } catch(error){
  
// }
 

//     }
//     showCards()


    
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("overdueCount").textContent = overdue;
  })
  .catch(error => console.error("Error loading tasks:", error));

  
// calculat payroll and display in the card

 


   

  

// set data from file attaendanceRecording in local storage and get it and display in attandance table

fetch("/assets/js/json/attendance-record.json")
  .then(response => response.json())
  .then(records => {
    const employeeStats = {};

    records.forEach(rec => {
      const empId = rec.employeeId;
// console.log(empId)
      if (!employeeStats[empId]) {
        employeeStats[empId] = {
          name: "Employee " + empId, 
          department: 0, 
          present: 0,
          late: 0,
          absent: 0,
          wfh: 0,
          penalties: 0
        };
      }

      
      if (rec.status === "Present") {
        employeeStats[empId].present++;

        if (rec.minutesLate > 0) {
          employeeStats[empId].late++;
          employeeStats[empId].penalties += rec.minutesLate * 5;
        }

        if (rec.isWFH) {
          employeeStats[empId].wfh++;
        }
      }

      
      if (rec.status === "Absent") {
        employeeStats[empId].absent++;
        employeeStats[empId].penalties += 100; 
      }
    });

    // let employeeData=getItem("employee");
   
    const tableBody = document.getElementById("reportTableBody");
    tableBody.innerHTML = ""; 

    Object.values(employeeStats).forEach(emp => {
      const row = `
        <tr>
        
          <td>${emp.name}</td>
          <td>${emp.department}</td>
          <td>${emp.present}</td>
          <td>${emp.late}</td>
          <td>${emp.absent}</td>
          <td>${emp.wfh}</td>
          <td>$${emp.penalties}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  })
  .catch(error => console.error("Error loading attendance data:", error));





Promise.all([
  fetch("/assets/js/json/employee.json").then(res => res.json()),
  fetch("/assets/js/json/attendance-record.json").then(res => res.json())
])
.then(([employees, records]) => {
  
  
  const employeesMap = {};
  employees.forEach(emp => {
    employeesMap[emp.employeeId] = {
      name: emp.name,
      department: emp.department
    };
  });

  const employeeStats = {};

  
  records.forEach(rec => {
    const empId = rec.employeeId;

    if (!employeeStats[empId]) {
      employeeStats[empId] = {
        name: employeesMap[empId]?.name || "Unknown",
        department: employeesMap[empId]?.department || "N/A",
        present: 0,
        late: 0,
        absent: 0,
        wfh: 0,
        penalties: 0
      };
    }

    if (rec.status === "Present") {
      employeeStats[empId].present++;

      // if (rec.minutesLate > 0) {
      //   employeeStats[empId].late++;
      //   employeeStats[empId].penalties += rec.minutesLate * 5;
      // }
      // if(rec.daysLate){
      // employeeStats[empId].late++;
      // employeeStats[empId].penalties += rec.minutesLate * 5;}

     
    }
     if (rec.isWFH) {
        employeeStats[empId].wfh++;
      }

    if (rec.status === "Absent") {
      employeeStats[empId].absent++;
      employeeStats[empId].penalties += 100;
    }
     if (rec.status === "late") {
      employeeStats[empId].late++;
      employeeStats[empId].penalties += 50;
    }
  });

  
  const tableBody = document.getElementById("reportTableBody");
  tableBody.innerHTML = "";

  Object.values(employeeStats).forEach(emp => {
    const row = `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.department}</td>
        <td>${emp.present}</td>
        <td>${emp.late}</td>
        <td>${emp.absent}</td>
        <td>${emp.wfh}</td>
        <td>$${emp.penalties}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
})
.catch(err => console.error("Error loading data:", err));
