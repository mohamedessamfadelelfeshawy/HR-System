import {
  fetchEmployee,
  getItem,
  setItem,
} from "../../../assets/js/exportFun.js";

async function fetchedData() {
  try {
    let allRequests = getItem("allRequests");
    if (!allRequests) {
      allRequests = await fetchEmployee(
        "../../../assets/js/json/requests.json"
      );
    }

    let allEmployees = getItem("allEmployees");
    if (!allEmployees) {
      allEmployees = await fetchEmployee(
        "../../../assets/js/json/employee.json"
      );
      setItem("allEmployees", allEmployees);
    }

    // هنا بعمل ربط بين ال requests و employees واضافة الاسم + القسم
    allRequests = allRequests.map((req) => {
      let emp = allEmployees.find((e) => e.id === req.employeeId);
      return {
        ...req,
        employeeName: emp ? emp.name : "Unknown",
        department: emp ? emp.department : "N/A",
      };
    });

    // حفظ النسخة الجديدة في localStorage
    setItem("allRequests", allRequests);

    createTable(allRequests, allEmployees);
  } catch (error) {
    console.error("error", error);
  }
}

function createTable(requests, employees) {
  let table = document.querySelector("#request-table");
  table.innerHTML = "";

  let tableHeader = document.createElement("thead");
  let tableHeadRow = document.createElement("tr");
  tableHeadRow.classList.add("text-nowrap", "text-center");

  let headers = [
    "ID",
    "Employee Name",
    "Department",
    "Request Type",
    "Date",
    "Status",
    "Action",
  ];
  headers.forEach((text) => {
    let th = document.createElement("th");
    th.textContent = text;
    tableHeadRow.appendChild(th);
  });

  tableHeader.appendChild(tableHeadRow);
  table.appendChild(tableHeader);

  let tableBody = document.createElement("tbody");
  tableBody.classList.add("text-center");
  table.appendChild(tableBody);

  requests.forEach((request) => {
    let row = document.createElement("tr");
    row.classList.add("text-nowrap");
    row.dataset.id = request.id;

    let tdId = document.createElement("td");
    tdId.textContent = request.employeeId;
    row.appendChild(tdId);

    let tdName = document.createElement("td");
    tdName.textContent = request.employeeName || "Unknown";
    row.appendChild(tdName);

    let tdDept = document.createElement("td");
    tdDept.textContent = request.department || "N/A";
    row.appendChild(tdDept);

    let tdType = document.createElement("td");
    tdType.innerHTML = `${request.type}<br/><small style='color:grey'>${
      request.notes || ""
    }</small>`;
    row.appendChild(tdType);

    let tdDate = document.createElement("td");
    tdDate.textContent = request.date;
    row.appendChild(tdDate);

    let tdStatus = document.createElement("td");
    let spanStatus = document.createElement("span");
    spanStatus.textContent = request.status;

    if (request.status === "Approved") {
      spanStatus.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
      spanStatus.style.color = "#198754";
    } else if (request.status === "Rejected") {
      spanStatus.style.backgroundColor = "rgba(244, 91, 105, 0.1)";
      spanStatus.style.color = "#f45b69";
    } else {
      spanStatus.style.backgroundColor = "rgba(239, 190, 18, 0.1)";
      spanStatus.style.color = "#efbe12";
    }

    spanStatus.style.fontWeight = "bold";
    spanStatus.style.padding = "5px";
    spanStatus.style.borderRadius = "5px";
    tdStatus.appendChild(spanStatus);
    row.appendChild(tdStatus);

    let tdAction = document.createElement("td");

    let approveButton = document.createElement("button");
    approveButton.textContent = "Approve";
    approveButton.classList.add("approve");
    approveButton.style.border = "none";
    approveButton.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
    approveButton.style.color = "#198754";
    approveButton.style.margin = "5px";
    approveButton.style.borderRadius = "5px";

    let rejectButton = document.createElement("button");
    rejectButton.textContent = "Reject";
    rejectButton.classList.add("reject");
    rejectButton.style.border = "none";
    rejectButton.style.backgroundColor = "rgba(244, 91, 105, 0.1)";
    rejectButton.style.color = "#f45b69";
    rejectButton.style.margin = "5px";
    rejectButton.style.borderRadius = "5px";

    if (request.status !== "Pending") {
      approveButton.disabled = true;
      rejectButton.disabled = true;
      approveButton.style.opacity = "0.6";
      rejectButton.style.opacity = "0.6";
      approveButton.style.cursor = "not-allowed";
      rejectButton.style.cursor = "not-allowed";
    }

    tdAction.appendChild(approveButton);
    tdAction.appendChild(rejectButton);
    row.appendChild(tdAction);

    tableBody.appendChild(row);
  });

  addEvents();
}

function addEvents() {
  let approveButtons = document.querySelectorAll(".approve");
  let rejectButtons = document.querySelectorAll(".reject");

  approveButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      let row = btn.closest("tr");
      let requestId = parseInt(row.dataset.id);

      let updatedRequest = updateRequestStatus(requestId, "Approved");
      if (updatedRequest) {
        updateAttendanceFiles(updatedRequest);
      }

      disableRowButtons(row);
    });
  });

  rejectButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      let row = btn.closest("tr");
      let requestId = parseInt(row.dataset.id);

      updateRequestStatus(requestId, "Rejected");

      disableRowButtons(row);
    });
  });
}

function updateRequestStatus(requestId, newStatus) {
  let requests = getItem("allRequests") || [];

  let request = requests.find((r) => r.id === requestId);
  if (request) {
    request.status = newStatus;
    requests.push(request);
    setItem("allRequests", requests);

    let row = document.querySelector(`tr[data-id="${requestId}"]`);
    let tdStatus = row.querySelector("td:nth-child(6) span");

    tdStatus.textContent = newStatus;

    if (newStatus === "Approved") {
      tdStatus.style.backgroundColor = "rgba(63, 194, 138, 0.1)";
      tdStatus.style.color = "#198754";
    } else if (newStatus === "Rejected") {
      tdStatus.style.backgroundColor = "rgba(244, 91, 105, 0.1)";
      tdStatus.style.color = "#f45b69";
    } else {
      tdStatus.style.backgroundColor = "rgba(239, 190, 18, 0.1)";
      tdStatus.style.color = "#efbe12";
    }
  }

  return request;
}

function updateAttendanceFiles(request) {
  let empId = request.employeeId;
  let date = request.date;

  let singleAttendance = getItem("employeesAttendanceInfo") || [];
  let record = singleAttendance.find(
    (a) => a.employeeId === empId && a.date === date
  );

  if (!record) {
    record = {
      id: singleAttendance.length + 1,
      employeeId: empId,
      employeeName: request.employeeName || "Unknown",
      department: request.department || "N/A",
      date: date,
      checkIn: "--",
      checkOut: "--",
      status: request.type === "WFH" ? "WFH" : "Leave",
      minutesLate: 0,
      isWFH: request.type === "WFH",
      isLeave: request.type !== "WFH",
      notes: request.notes || request.type,
    };
    singleAttendance.push(record);
  } else {
    record.status = request.type === "WFH" ? "WFH" : "Leave";
    record.isWFH = request.type === "WFH";
    record.isLeave = request.type !== "WFH";
    record.notes = request.notes || request.type;
  }

  setItem("employeesAttendanceInfo", singleAttendance);

  let attendanceRecord = getItem("AttendanceRecord") || [];
  let month = date.slice(0, 7);

  let monthly = attendanceRecord.find(
    (a) => a.employeeId === empId && a.month === month
  );

  if (!monthly) {
    monthly = {
      id: attendanceRecord.length + 1,
      employeeId: empId,
      employeeName: request.employeeName || "Unknown",
      department: request.department || "N/A",
      month: month,
      present: 0,
      absent: 0,
      leave: 0,
      wfh: 0,
    };
    attendanceRecord.push(monthly);
  }

  if (request.type === "WFH") {
    monthly.wfh += 1;
  } else {
    monthly.leave += 1;
  }

  setItem("AttendanceRecord", attendanceRecord);
}

function disableRowButtons(row) {
  let approveBtn = row.querySelector(".approve");
  let rejectBtn = row.querySelector(".reject");

  approveBtn.disabled = true;
  rejectBtn.disabled = true;

  approveBtn.style.opacity = "0.6";
  rejectBtn.style.opacity = "0.6";
  approveBtn.style.cursor = "not-allowed";
  rejectBtn.style.cursor = "not-allowed";
}

fetchedData();

// dark mode and logOut
const html = document.documentElement; // <html>
const btn = document.getElementById("toggleTheme");
const logoutIcon = document.querySelector(".logoutIcon");
logoutIcon.addEventListener("click", () => {
  localStorage.removeItem("employee");
  window.location = "../../../index.html";
});
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
