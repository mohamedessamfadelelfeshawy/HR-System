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
          <td>Employee ${item.employeeId}</td> <!-- هنستبدلها بالاسم الحقيقي لو عندنا فايل employees -->
          <td>${monthFormatted}</td>
          <td>${item.baseSalary}</td>
          <td>${item.deductions}</td>
          <td>${item.bonus}</td>
          <td>0</td> 
          <td>${item.netSalary}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  })
  .catch(err => console.error("Error loading payroll:", err));
