import {
  fetchEmployee,
  getItem,
  setItem,
} from "../../../assets/js/exportFun.js";

// --- متغيرات خاصة بالـ Pagination ---
let allRequestsData = []; // سيحتوي هذا المتغير على جميع الطلبات بعد جلبها ومعالجتها
let currentPage = 1;
const rowsPerPage = 10; // يمكنك تغيير هذا الرقم لعرض عدد مختلف من الصفوف في الصفحة

// --- عناصر HTML ---
const paginationWrapper = document.getElementById("pagination-wrapper");
const tableBody = document.querySelector("#request-table tbody") || createTbody(); // التأكد من وجود tbody

// دالة مساعدة لإنشاء tbody إذا لم يكن موجودًا
function createTbody() {
  const table = document.querySelector("#request-table");
  let tbody = table.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    tbody.classList.add("text-center");
    table.appendChild(tbody);
  }
  return tbody;
}


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

    allRequests = allRequests.map((req) => {
      let emp = allEmployees.find((e) => e.id === req.employeeId);
      return {
        ...req,
        employeeName: emp ? emp.name : "Unknown",
        department: emp ? emp.department : "N/A",
      };
    });

    setItem("allRequests", allRequests);
    
    // تخزين البيانات في المتغير العام للوصول إليها لاحقًا
    allRequestsData = allRequests;
    
    // إعداد الـ Pagination وعرض الصفحة الأولى
    setupPagination();
    displayPage(currentPage);

  } catch (error) {
    console.error("error", error);
  }
}

// تم تعديل createTable ليعرض فقط "جزء" من البيانات
function createTable(requests) {
  const table = document.querySelector("#request-table");
  let tbody = table.querySelector("tbody");
  if (!tbody) tbody = createTbody();
  tbody.innerHTML = ""; // نفرغ فقط الـ tbody وليس الجدول بأكمله

  // إذا لم يكن هناك header، قم بإنشائه
  if (!table.querySelector("thead")) {
    let tableHeader = document.createElement("thead");
    let tableHeadRow = document.createElement("tr");
    tableHeadRow.classList.add("text-nowrap", "text-center");
    let headers = ["ID", "Employee Name", "Department", "Request Type", "Date", "Status", "Action"];
    headers.forEach((text) => {
      let th = document.createElement("th");
      th.textContent = text;
      tableHeadRow.appendChild(th);
    });
    tableHeader.appendChild(tableHeadRow);
    table.insertBefore(tableHeader, tbody);
  }

  requests.forEach((request) => {
    let row = document.createElement("tr");
    row.classList.add("text-nowrap");
    row.dataset.id = request.id;

    // (نفس كود بناء الصفوف من الكود الأصلي)
    row.innerHTML = `
      <td>${request.employeeId}</td>
      <td>${request.employeeName || "Unknown"}</td>
      <td>${request.department || "N/A"}</td>
      <td>${request.type}<br/><small style='color:grey'>${request.notes || ""}</small></td>
      <td>${request.date}</td>
      <td>
        <span style="font-weight: bold; padding: 5px; border-radius: 5px; background-color: ${
          request.status === "Approved" ? "#198754" : request.status === "Rejected" ? "#dc3545" : "#ffc107"
        };">${request.status}</span>
      </td>
      <td>
        <button class="approve" style="border: none; background-color: #198754; margin: 5px; border-radius: 5px;">Approve</button>
        <button class="reject" style="border: none; background-color: #dc3545; margin: 5px; border-radius: 5px;">Reject</button>
      </td>
    `;
    
    tbody.appendChild(row);

    if (request.status !== "Pending") {
      const approveButton = row.querySelector(".approve");
      const rejectButton = row.querySelector(".reject");
      approveButton.disabled = true;
      rejectButton.disabled = true;
      approveButton.style.opacity = "0.6";
      rejectButton.style.opacity = "0.6";
      approveButton.style.cursor = "not-allowed";
      rejectButton.style.cursor = "not-allowed";
    }
  });

  // إضافة الأحداث للأزرار الجديدة التي تم عرضها
  addEvents();
}

// --- دوال جديدة خاصة بالـ Pagination ---

/**
 * دالة لعرض صفحة محددة من البيانات
 * @param {number} page - رقم الصفحة المراد عرضها
 */
function displayPage(page) {
    currentPage = page;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = allRequestsData.slice(start, end);

    createTable(paginatedItems);
    updatePaginationButtons();
}

/**
 * دالة لإنشاء أزرار التنقل
 */
function setupPagination() {
    paginationWrapper.innerHTML = "";
    const pageCount = Math.ceil(allRequestsData.length / rowsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const btn = createPaginationButton(i);
        paginationWrapper.appendChild(btn);
    }
}

/**
 * دالة مساعدة لإنشاء زر واحد
 * @param {number} page - رقم الصفحة
 */
function createPaginationButton(page) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    const a = document.createElement("a");
    a.classList.add("page-link");
    a.href = "#";
    a.innerText = page;
    li.appendChild(a);

    a.addEventListener("click", (e) => {
        e.preventDefault();
        displayPage(page);
    });

    return li;
}

/**
 * دالة لتحديث حالة الزر النشط
 */
function updatePaginationButtons() {
    const pageItems = paginationWrapper.querySelectorAll(".page-item");
    pageItems.forEach((item, index) => {
        if (index + 1 === currentPage) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}


// --- تعديل دوال الأحداث والمعالجة ---

function addEvents() {
  let approveButtons = document.querySelectorAll(".approve:not([disabled])");
  let rejectButtons = document.querySelectorAll(".reject:not([disabled])");

  approveButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      let row = btn.closest("tr");
      let requestId = parseInt(row.dataset.id);

      let updatedRequest = updateRequestStatus(requestId, "Approved");
      if (updatedRequest) {
        updateAttendanceFiles(updatedRequest);
      }
      // إعادة عرض الصفحة الحالية لتحديث البيانات والأزرار
      allRequestsData = getItem("allRequests"); // تحديث البيانات من المصدر
      displayPage(currentPage);
    });
  });

  rejectButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      let row = btn.closest("tr");
      let requestId = parseInt(row.dataset.id);
      updateRequestStatus(requestId, "Rejected");

      // إعادة عرض الصفحة الحالية لتحديث البيانات والأزرار
      allRequestsData = getItem("allRequests"); // تحديث البيانات من المصدر
      displayPage(currentPage);
    });
  });
}

function updateRequestStatus(requestId, newStatus) {
  let requests = getItem("allRequests") || [];
  let requestUpdated = null;

  // استخدام map لإنشاء مصفوفة جديدة بالتحديث المطلوب
  const updatedRequests = requests.map(r => {
    if (r.id === requestId) {
      requestUpdated = { ...r, status: newStatus };
      return requestUpdated;
    }
    return r;
  });

  if (requestUpdated) {
    setItem("allRequests", updatedRequests);
  }
  
  return requestUpdated;
}

// (الكود زي ما هو فوق .. مع تعديل دالة updateAttendanceFiles بس)

// function updateAttendanceFiles(request) {
//   let empId = request.employeeId;
//   let date = request.date;

//   let singleAttendance = getItem("employeesAttendanceInfo") || [];
//   let record = singleAttendance.find(
//     (a) => a.employeeId === empId && a.date === date
//   );

//   if (!record) {
//     // لو مفيش record قبل كده نضيف واحد جديد
//     record = {
//       id: singleAttendance.length + 1,
//       employeeId: empId,
//       employeeName: request.employeeName || "Unknown",
//       department: request.department || "N/A",
//       date: date,
//       checkIn: request.type === "WFH" ? (request.checkIn || "09:00") : "--",
//       checkOut: request.type === "WFH" ? (request.checkOut || "16:45") : "--",
//       status: request.type, // يساوي WFH أو Leave حسب النوع
//       minutesLate: request.type === "WFH" ? (request.minutesLate || 0) : 0,
//       isWFH: request.type === "WFH",
//       isLeave: request.type === "Leave",
//       notes: request.notes || (request.type === "WFH" ? "Working from home" : request.type),
//     };
//     singleAttendance.unshift(record);
//   } else {
//     // لو موجود بالفعل نحدث البيانات
//     record.status = request.type;
//     record.isWFH = request.type === "WFH";
//     record.isLeave = request.type === "Leave";
//     record.checkIn = request.type === "WFH" ? (request.checkIn || "09:00") : "--";
//     record.checkOut = request.type === "WFH" ? (request.checkOut || "16:45") : "--";
//     record.minutesLate = request.type === "WFH" ? (request.minutesLate || 0) : 0;
//     record.notes = request.notes || (request.type === "WFH" ? "Working from home" : request.type);
//   }

//   setItem("employeesAttendanceInfo", singleAttendance);

//   // --- تحديث AttendanceRecord الشهري ---
//   let attendanceRecord = getItem("AttendanceRecord") || [];
//   let month = date.slice(0, 7);

//   let monthly = attendanceRecord.find(
//     (a) => a.employeeId === empId && a.month === month
//   );

//   if (!monthly) {
//     monthly = {
//       id: attendanceRecord.length + 1,
//       employeeId: empId,
//       employeeName: request.employeeName || "Unknown",
//       department: request.department || "N/A",
//       month: month,
//       present: 0,
//       absent: 0,
//       leave: 0,
//       wfh: 0,
//     };
//     attendanceRecord.unshift(monthly);
//   }

//   if (request.type === "WFH") {
//     monthly.wfh += 1;
//   } else if (request.type === "Leave") {
//     monthly.leave += 1;
//   }

//   setItem("AttendanceRecord", attendanceRecord);
// }
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
      status: "Absence",
      minutesLate: 0,
      isWFH: false,
      isLeave: false,
      notes: request.notes || "Absent",
    };
    singleAttendance.unshift(record);
  }

  // تحديث بناءً على نوع الطلب
  if (request.type === "WFH") {
    record.status = "WFH";
    record.checkIn = request.checkIn || "09:00";
    record.checkOut = request.checkOut || "16:45";
    record.isWFH = true;
    record.isLeave = false;
    record.minutesLate = request.minutesLate || 0;
    record.notes = request.notes || "Working from home";
  } else if (request.type === "Leave") {
    record.status = "Leave";
    record.checkIn = "--";
    record.checkOut = "--";
    record.isWFH = false;
    record.isLeave = true;
    record.minutesLate = 0;
    record.notes = request.notes || "Leave request";
  } else if (request.type === "Absence") {
    record.status = "Absence";
    record.checkIn = "--";
    record.checkOut = "--";
    record.isWFH = false;
    record.isLeave = false;
    record.minutesLate = 0;
    record.notes = request.notes || "Absent";
  }

  setItem("employeesAttendanceInfo", singleAttendance);

  // --- تحديث AttendanceRecord الشهري ---
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
    attendanceRecord.unshift(monthly);
  }

  // تحديث الإحصائيات
  if (request.type === "WFH") {
    monthly.wfh += 1;
  } else if (request.type === "Leave") {
    monthly.leave += 1;
  } else if (request.type === "Absence") {
    monthly.absent += 1;
  }

  setItem("AttendanceRecord", attendanceRecord);
}


// --- تشغيل الكود ---
fetchedData();


// --- dark mode and logOut (يبقى كما هو) ---
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const logoutIcon = document.querySelector(".logoutIcon");
logoutIcon.addEventListener("click", () => {
  localStorage.removeItem("employee");
  window.location = "../../../index.html";
});

// حفظ الثيم المختار
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-bs-theme", savedTheme);

btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});