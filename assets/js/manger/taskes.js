import { fetchEmployee, setItem, getItem } from "../../../assets/js/exportFun.js";

const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");
const logoutIcon = document.querySelector(".logoutIcon");
const paginationWrapper = document.getElementById("pagination-wrapper");

let allTasksData = [];
let currentFilteredData = [];
let currentPage = 1;
const rowsPerPage = 10;

// Add Task Modal Elements
const saveTask = document.getElementById('saveTask');
const taskTitle = document.getElementById('taskTitle');
const taskAssigned = document.getElementById('taskAssigned');
const taskDeadline = document.getElementById('taskDeadline');
const taskId = document.getElementById('taskId');
const nameError = document.getElementById("nameError");
const titleError = document.getElementById("titleError");
const errorId = document.getElementById("errorId");
const taskStatus = document.getElementById("taskStatus");
const addTaskModal = document.getElementById("addTaskModal");

// Edit Task Modal Elements
const editTaskModal = document.getElementById("editTaskModal");
const updateTaskBtn = document.getElementById('updateTask');
const editTaskIndexInput = document.getElementById('editTaskIndex');
const editTaskId = document.getElementById('editTaskId');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskAssigned = document.getElementById('editTaskAssigned');
const editTaskDeadline = document.getElementById('editTaskDeadline');
const editTaskStatus = document.getElementById('editTaskStatus');
const editNameError = document.getElementById("editNameError");
const editTitleError = document.getElementById("editTitleError");
const editErrorId = document.getElementById("editErrorId");



function displayPageOfData(items) {
    let tableRows = "";
    if (!items || items.length === 0) {
        tBody.innerHTML = `<tr><td colspan="6" class="text-center">No tasks to display</td></tr>`;
        return;
    }

    items.forEach((task, originalIndex) => {
        let statusClass = "bg-success"; // Done
        if (task.status === "Pending") statusClass = "bg-warning";
        else if (task.status === "In Progress") statusClass = "bg-info";

        tableRows += `
            <tr>
                <td>${task.id}</td>
                <td>${task.description}</td>
                <td>${task.name}</td>
                <td>${task.dueDate}</td>
                <td>
                    <span class="px-2 py-1 special-status rounded ${statusClass}">${task.status}</span>
                </td>
                <td>
                    <button class="edit-btn btn btn-sm" data-id="${task.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="delete-btn btn btn-sm text-danger" data-id="${task.id}"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </td>
            </tr>`;
    });
    tBody.innerHTML = tableRows;
    attachActionListeners();
}

function setupPaginationControls() {
    paginationWrapper.innerHTML = "";
    const pageCount = Math.ceil(currentFilteredData.length / rowsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement("li");
        li.classList.add("page-item");
        if (i === currentPage) li.classList.add("active");

        const a = document.createElement("a");
        a.classList.add("page-link");
        a.href = "#";
        a.innerText = i;
        li.appendChild(a);

        a.addEventListener("click", (e) => {
            e.preventDefault();
            renderPage(i);
        });
        paginationWrapper.appendChild(li);
    }
}

function renderPage(pageNumber) {
    currentPage = pageNumber;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = currentFilteredData.slice(start, end);
    
    displayPageOfData(paginatedItems);
    
    document.querySelectorAll(".page-item").forEach(item => {
        item.classList.remove("active");
        if (parseInt(item.querySelector('.page-link').innerText) === currentPage) {
            item.classList.add("active");
        }
    });
}

function refreshDataAndView() {
    const searchTerm = search.value.toLowerCase().trim();
    currentFilteredData = searchTerm === "" 
        ? [...allTasksData]
        : allTasksData.filter(task => task.name.toLowerCase().includes(searchTerm));

    const totalPages = Math.ceil(currentFilteredData.length / rowsPerPage) || 1;
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    
    setupPaginationControls();
    renderPage(currentPage);
}



function attachActionListeners() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const taskIdToDelete = e.currentTarget.dataset.id;
            allTasksData = allTasksData.filter(task => task.id != taskIdToDelete);
            setItem("allTasks", allTasksData);
            refreshDataAndView();
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const taskIdToEdit = e.currentTarget.dataset.id;
            const taskIndex = allTasksData.findIndex(task => task.id == taskIdToEdit);
            if (taskIndex !== -1) {
                populateEditModal(taskIndex);
                const modal = new bootstrap.Modal(editTaskModal);
                modal.show();
            }
        });
    });
}

function addTask() {
    let isIdValid = validateId(taskId, errorId);
    let isTitleValid = validateTitle(taskTitle, titleError);
    let isNameValid = validateName(taskAssigned, nameError);

    if (taskDeadline.value && taskStatus.value && isTitleValid && isNameValid && isIdValid) {
        const newTask = {
            id: taskId.value.trim(),
            employeeId: Number(taskId.value.trim()),
            name: taskAssigned.value.trim(),
            description: taskTitle.value.trim(),
            status: taskStatus.value,
            dueDate: taskDeadline.value,
        };
        allTasksData.unshift(newTask);
        setItem("allTasks", allTasksData);
        refreshDataAndView();
        clearData();
        bootstrap.Modal.getInstance(addTaskModal).hide();
    }
}

function updateTask() {
    const index = editTaskIndexInput.value;
    let isIdValid = validateId(editTaskId, editErrorId);
    let isTitleValid = validateTitle(editTaskTitle, editTitleError);
    let isNameValid = validateName(editTaskAssigned, editNameError);

    if (index !== "" && isIdValid && isTitleValid && isNameValid) {
        allTasksData[index].id = editTaskId.value.trim();
        allTasksData[index].employeeId = Number(editTaskId.value.trim());
        allTasksData[index].description = editTaskTitle.value.trim();
        allTasksData[index].name = editTaskAssigned.value.trim();
        allTasksData[index].dueDate = editTaskDeadline.value;
        allTasksData[index].status = editTaskStatus.value;

        setItem("allTasks", allTasksData);
        refreshDataAndView();
        bootstrap.Modal.getInstance(editTaskModal).hide();
    }
}



function populateEditModal(index) {
    const task = allTasksData[index];
    editTaskIndexInput.value = index;
    editTaskId.value = task.id;
    editTaskTitle.value = task.description;
    editTaskAssigned.value = task.name;
    editTaskDeadline.value = task.dueDate;
    editTaskStatus.value = task.status;
}

function clearData() {
    taskId.value = "";
    taskTitle.value = "";
    taskAssigned.value = "";
    taskDeadline.value = "";
    taskStatus.value = "Pending";
    errorId.innerText = "";
    titleError.innerText = "";
    nameError.innerText = "";
}

function validateName(input, errorEl) {
    const value = input.value.trim();
    if (!/^[a-zA-Z ]+$/.test(value) || value === "") {
        errorEl.innerText = "Name is required and must be letters.";
        return false;
    }
    errorEl.innerText = "";
    return true;
}

function validateTitle(input, errorEl) {
    const value = input.value.trim();
    if (!/^[a-zA-Z0-9 ]+$/.test(value) || value === "") {
        errorEl.innerText = "Title is required.";
        return false;
    }
    errorEl.innerText = "";
    return true;
}

function validateId(input, errorEl) {
    const value = input.value.trim();
    if (!/^[0-9]+$/.test(value)) {
        errorEl.innerText = "ID is required and must be a number.";
        return false;
    }
    errorEl.innerText = "";
    return true;
}



search.addEventListener("input", () => {
    refreshDataAndView();
});

saveTask.addEventListener("click", addTask);
updateTaskBtn.addEventListener("click", updateTask);

logoutIcon.addEventListener("click", () => {
    localStorage.removeItem("employee");
    window.location = "../../../index.html";
});

const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-bs-theme", savedTheme);
btn.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    html.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

// Initial Load
(() => {
    allTasksData = getItem("allTasks") || [];
    refreshDataAndView();
})();