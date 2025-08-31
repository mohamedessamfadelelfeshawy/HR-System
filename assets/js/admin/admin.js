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

// cards to display total
document.addEventListener("DOMContentLoaded", () => {
  fetch("/assets/js/json/attendance_single_day.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      let wfhCount = 0;

      data.forEach(record => {
        if (record.status === "Present") {
          presentCount++;
          if (record.minutesLate > 0) {
            lateCount++;
          }
        } else if (record.status === "Absent") {
          absentCount++;
        }
        if (record.isWFH) {
          wfhCount++;
        }
      });

      
      document.getElementById("totalPresent").textContent = presentCount;
      document.getElementById("totalLate").textContent = lateCount;
      document.getElementById("totalAbsent").textContent = absentCount;
      document.getElementById("totalWFH").textContent = wfhCount;
    })
    .catch(error => console.error("Error fetching JSON:", error));
});


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

    
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("overdueCount").textContent = overdue;
  })
  .catch(error => console.error("Error loading tasks:", error));


// calculat payroll and display in the card

 


   

  

