import {
  fetchEmployee,
  setItem,
  getItem,
} from "../../../assets/js/exportFun.js";

// --- عناصر HTML ---
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");
const logoutIcon = document.querySelector(".logoutIcon");
const paginationWrapper = document.getElementById("pagination-wrapper"); // عنصر أزرار التنقل الجديد

// --- متغيرات خاصة بالـ Pagination ---
let currentPage = 1;
const rowsPerPage = 10; // يمكنك تغيير هذا الرقم لعرض عدد مختلف من الصفوف في الصفحة
let currentFilteredData = []; // سيحتوي هذا المتغير على البيانات التي يتم عرضها حاليًا (سواء كانت كاملة أو بعد البحث)

async function calculateSalaries() {
  const allEmployees = getItem("allEmployees");
  const settings = getItem("setting system");
  const attendanceRecords = getItem("attendanceManager");

  console.log(attendanceRecords);
  
  if (!attendanceRecords || !allEmployees || !settings) {
    console.error("error: (allEmployees, setting system, attendanceRecords) ");
    return;
  }

  const updatedEmployees = allEmployees.map((employee) => {
    const employeeRecords = attendanceRecords.filter(
      (record) => record.employeeId == employee.id
    );

    let lateCount = 0;
    let absentCount = 0;

    employeeRecords.forEach((record) => {
      if (record.status === "Late") {
        lateCount++;
      } else if (record.status === "Absent") {
        absentCount++;
      }
    });

    const dailyRate = (employee.monthlySalary || 0) / 30;

    const lateDeductionAmount =
      dailyRate * ((settings.late || 0) / 100) * lateCount;
    const absentDeductionAmount =
      dailyRate * ((settings.absent || 0) / 100) * absentCount;
    const totalPenalties = lateDeductionAmount + absentDeductionAmount;

    let newNetSalary = (employee.monthlySalary || 0) - totalPenalties;

    if (lateCount === 0 && absentCount === 0 && (settings.bonus || 0) > 0) {
      const bonusDiscount =
        (employee.monthlySalary || 0) * ((settings.bonus || 0) / 100);
      newNetSalary = Math.min(
        employee.monthlySalary,
        newNetSalary + bonusDiscount
      );
    }

    return {
      ...employee,
      Penalties: totalPenalties.toFixed(2),
      NetSalary: newNetSalary.toFixed(2),
    };
  });

  setItem("allEmployees", updatedEmployees);
}

logoutIcon.addEventListener("click", () => {
  localStorage.removeItem("employee");
  window.location.replace("../../../index.html");
});

// --- دوال الـ Pagination الجديدة ---

/**
 * دالة لعرض صفوف الجدول بناءً على مصفوفة بيانات محددة
 * @param {Array} arr - مصفوفة البيانات التي سيتم عرضها في الجدول
 */
function displayData(arr) {
  let emp = "";
  if (!arr) {
    tBody.innerHTML = "";
    return;
  }
  arr.forEach((el) => {
    emp += `
      <tr>
          <td>${el.employeeId}</td>
          <td>${el.employeeName}</td>
          <td>${el.date}</td>
          <td>${el.checkIn}</td>
          <td>${el.checkOut}</td>
          <td>
            <span class="px-2 py-1 special-status rounded ${
              el.status === "Present"
                ? "bg-success"
                : el.status === "Absent"
                ? "bg-danger"
                : "bg-warning"
            }">${el.status}</span>
          </td>
      </tr>`;
  });
  tBody.innerHTML = emp;
}

/**
 * دالة لإنشاء أزرار التنقل بين الصفحات
 * @param {Array} items - كامل البيانات لتحديد عدد الصفحات
 * @param {HTMLElement} wrapper - العنصر الذي سيحتوي على الأزرار
 */
function setupPagination(items, wrapper) {
  wrapper.innerHTML = "";
  const pageCount = Math.ceil(items.length / rowsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = createPaginationButton(i);
    wrapper.appendChild(btn);
  }
}

/**
 * دالة مساعدة لإنشاء زر واحد من أزرار التنقل
 * @param {number} page - رقم الصفحة للزر
 * @returns {HTMLElement} - عنصر <li> للزر
 */
function createPaginationButton(page) {
  const li = document.createElement("li");
  li.classList.add("page-item");
  if (page === currentPage) {
    li.classList.add("active");
  }

  const a = document.createElement("a");
  a.classList.add("page-link");
  a.href = "#";
  a.innerText = page;

  li.appendChild(a);

  li.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = page;
    updatePage(); // استدعاء دالة التحديث
  });

  return li;
}

/**
 * دالة لتحديث عرض الجدول والأزرار بناءً على الصفحة الحالية
 */
function updatePage() {
    // 1. حساب "شريحة" البيانات التي يجب عرضها
    const start = rowsPerPage * (currentPage - 1);
    const end = start + rowsPerPage;
    const paginatedItems = currentFilteredData.slice(start, end);

    // 2. عرض البيانات المقطوعة في الجدول
    displayData(paginatedItems);

    // 3. تحديث الفئة "active" على الأزرار
    const pageButtons = document.querySelectorAll(".page-item");
    pageButtons.forEach((button) => {
        button.classList.remove("active");
        // نحول innerText إلى رقم للمقارنة
        if (parseInt(button.querySelector('.page-link').innerText) === currentPage) {
            button.classList.add("active");
        }
    });
}


// --- تعديل دالة البحث لتعمل مع الـ Pagination ---
search.addEventListener("input", (e) => {
  e.preventDefault();
  const searchTerm = search.value.toLowerCase();
  
  if (window.attendants) {
    if (searchTerm === "") {
      currentFilteredData = [...window.attendants]; // إذا كان البحث فارغًا، اعرض كل البيانات
    } else {
      currentFilteredData = window.attendants.filter((el) =>
        el.status.toLowerCase().includes(searchTerm)
      );
    }
    
    // عند البحث، ارجع دائمًا للصفحة الأولى
    currentPage = 1; 
    setupPagination(currentFilteredData, paginationWrapper);
    updatePage();
  }
});

// --- dark mode ---
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-bs-theme", savedTheme);

btn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// --- تعديل الكود الرئيسي عند بدء التشغيل ---
(async () => {
  window.attendants = getItem("AttendanceRecord") || [];
  currentFilteredData = [...window.attendants]; // في البداية، البيانات المفلترة هي كل البيانات

  // قم بإنشاء أزرار التنقل وعرض الصفحة الأولى
  setupPagination(currentFilteredData, paginationWrapper);
  updatePage();

  await calculateSalaries();
})();