import { fetchEmployee, setItem, getItem } from "../../../assets/js/exportFun.js";
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const tBody = document.getElementById("tBody");
const search = document.getElementById("search");
const logoutIcon = document.querySelector(".logoutIcon");

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


/* logOut */
logoutIcon.addEventListener("click", () => {
    localStorage.removeItem("employee");
    window.location = "../../../index.html"
})
/* validate name */
function validateName(input, errorEl) {
    const value = input.value.trim();
    if (!/^[a-zA-Z ]+$/.test(value) || value === "") {
        errorEl.innerText = "Name is required and must be letters.";
        return false;
    } else {
        errorEl.innerText = "";
        return true;
    }
}
/* validate title */
function validateTitle(input, errorEl) {
    const value = input.value.trim();
    if (!/^[a-zA-Z0-9 ]+$/.test(value) || value === "") {
        errorEl.innerText = "Title is required.";
        return false;
    } else {
        errorEl.innerText = "";
        return true;
    }
}
//VALIDATE ID
function validateId(input, errorEl) {
    const value = input.value.trim();
    if (!/^[0-9]+$/.test(value)) {
        errorEl.innerText = "ID is required and must be a number.";
        return false;
    } else {
        errorEl.innerText = "";
        return true;
    }
}

/* tasks */
let dataTasks=await fetchEmployee("/assets/js/json/tasks.json");
setItem("allTasks", dataTasks);
let localTasks = getItem("allTasks");
displayData(localTasks);

/* DISPLAY DATA AND ATTACH EVENT LISTENERS */
function displayData(arr) {
    let emp = "";
    arr.map((el, idx) => {
        emp += `   <tr>
              <td>${el.id}</td>
              <td>${el.description}</td>
              <td>${el.name}</td>
              <td>${el.dueDate}</td>
                 <td>
                    <span class="px-2 py-1 special-status rounded ${el.status === "Pending"
                ? "bg-warning"
                : el.status === "In Progress"
                    ? "bg-info"
                    : "bg-success" // Changed danger to success for "Done"
            }">${el.status}</span>
                </td>
                <td>
                    <button class="edit-btn btn btn-sm" data-idx="${idx}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="delete-btn btn btn-sm text-danger" data-idx="${idx}"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </td>
            </tr>`
    })
    tBody.innerHTML = emp;
    attachActionListeners();
}

/* ATTACH LISTENERS FOR EDIT AND DELETE BUTTONS */
function attachActionListeners() {
    // Delete task
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let idx = e.currentTarget.dataset.idx;
            localTasks.splice(idx, 1);
            setItem("allTasks", localTasks);
            displayData(localTasks);
        });
    });

    // Edit task
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let idx = e.currentTarget.dataset.idx;
            populateEditModal(idx);
            const modal = new bootstrap.Modal(editTaskModal);
            modal.show();
        });
    });
}

/* POPULATE EDIT MODAL WITH TASK DATA */
function populateEditModal(index) {
    const task = localTasks[index];
    editTaskIndexInput.value = index;
    editTaskId.value = task.id;
    editTaskTitle.value = task.description;
    editTaskAssigned.value = task.name;
    editTaskDeadline.value = task.dueDate;
    editTaskStatus.value = task.status;
}

/* search */
search.addEventListener("input", (e) => {
    e.preventDefault();
    let arrFilter = localTasks.filter(el => el.name.toLowerCase().includes(search.value.toLowerCase()));
    displayData(arrFilter);
})

//clear INPUTS
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

//CREATE TASK
function addTask() {
    let isIdValid = validateId(taskId, errorId);
    let isTitleValid = validateTitle(taskTitle, titleError);
    let isNameValid = validateName(taskAssigned, nameError);
    let deadline = taskDeadline.value;
    let statue = taskStatus.value;

    if (deadline && statue && isTitleValid && isNameValid && isIdValid) {
        let newTask = {
            "id": taskId.value.trim(),
            "employeeId": taskId.value.trim(),
            "name": taskAssigned.value.trim(),
            "description": taskTitle.value.trim(),
            "status": statue,
            "dueDate": deadline,
        };
        localTasks.unshift(newTask);
        setItem("allTasks", localTasks);
        displayData(localTasks);
        clearData();
        const modal = bootstrap.Modal.getInstance(addTaskModal);
        modal.hide();
    }
}

// UPDATE TASK
function updateTask() {
    const index = editTaskIndexInput.value;
    let isIdValid = validateId(editTaskId, editErrorId);
    let isTitleValid = validateTitle(editTaskTitle, editTitleError);
    let isNameValid = validateName(editTaskAssigned, editNameError);

    if (index !== "" && isIdValid && isTitleValid && isNameValid) {
        localTasks[index].id = editTaskId.value.trim();
        localTasks[index].employeeId = editTaskId.value.trim();
        localTasks[index].description = editTaskTitle.value.trim();
        localTasks[index].name = editTaskAssigned.value.trim();
        localTasks[index].dueDate = editTaskDeadline.value;
        localTasks[index].status = editTaskStatus.value;

        setItem("allTasks", localTasks);
        displayData(localTasks);

        const modal = bootstrap.Modal.getInstance(editTaskModal);
        modal.hide();
    }
}


saveTask.addEventListener("click", addTask);
updateTaskBtn.addEventListener("click", updateTask);

/* dark mode */
html.setAttribute("data-bs-theme", "light");
btn.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-bs-theme");
    if (currentTheme === "light") {
        html.setAttribute("data-bs-theme", "dark");
    } else {
        html.setAttribute("data-bs-theme", "light");
    }
});