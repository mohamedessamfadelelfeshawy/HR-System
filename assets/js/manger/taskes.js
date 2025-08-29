// popup start
document.getElementById("saveTask").addEventListener("click", function () {
  const title = document.getElementById("taskTitle").value;
  const assigned = document.getElementById("taskAssigned").value;
  const deadline = document.getElementById("taskDeadline").value;
  const status = document.getElementById("taskStatus").value;

  if (title && assigned && deadline) {
    const tableBody = document.querySelector("table tbody");
    const rowCount = tableBody.rows.length + 1;

    const newRow = `
      <tr>
        <td>${rowCount}</td>
        <td>${title}</td>
        <td>${assigned}</td>
        <td>${deadline}</td>
        <td><span class="badge bg-warning">${status}</span></td>
        <td>
          <button class="btn btn-sm "><i class="fas fa-check-circle text-success"></i></button>
          <button class="btn btn-sm text-danger"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", newRow);

    
    document.getElementById("taskForm").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
    modal.hide();
  }
});

// popup end


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