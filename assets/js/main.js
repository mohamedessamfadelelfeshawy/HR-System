/// <reference types="../@types/jquery" />
const html = document.documentElement;
const btn = document.getElementById("toggleTheme");
const valEmail = document.getElementById("email");
const valPassword = document.getElementById("password");
const submit = document.getElementById("submitting");
const errorEmailSpace = document.getElementById("errorEmailSpace");
const errorEmailRegix = document.getElementById("errorEmailRegix");
const errorPasswordSpace = document.getElementById("errorPasswordSpace");
const errorPasswordChar = document.getElementById("errorPasswordChar");
//  console.log(errorPasswordChar);


/* dark mood */
btn.addEventListener("click", () => {
  if (html.getAttribute("data-bs-theme") === "dark") {
    html.setAttribute("data-bs-theme", "light");
    btn.style.color = "#183153";
  } else {
    html.setAttribute("data-bs-theme", "dark");
    btn.style.color = "white";
  }
});

/* validate email */
const validateEmail = (val, errorMessage, errorMessage2) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!val.trim()) {
    errorMessage.classList.remove("d-none");
    errorMessage2.classList.add("d-none");
    return false;

  } else if (!regex.test(val)) {
    errorMessage2.classList.remove("d-none");
    errorMessage.classList.add("d-none");
    return false;
  }
  else {
    errorMessage.classList.add("d-none");
    errorMessage2.classList.add("d-none");
    return true;
  }

}

/* validate password */
const validatePassword = (val, errorMessage, errorMessage2) => {
  if (!val.trim()) {
    errorMessage.classList.remove("d-none");
    errorMessage2.classList.add("d-none");
    return false;

  } else if (val.length <= 6) {
    errorMessage2.classList.remove("d-none");
    errorMessage.classList.add("d-none");
    return false;
  }
  else {
    errorMessage2.classList.add("d-none");
    errorMessage.classList.add("d-none");
    return true;
  }

}

/* clear Data */
const clearData = () => {
  valEmail.value = ""
  valPassword.value = "";
}

/* fun  get  employee AND put in localStorage */
const getEmployee = (employee, enterRole) => {
  let welcomeEmployee = employee.find(
    (em) => em.email.toLowerCase().trim() === valEmail.value.toLowerCase().trim() &&
      em.role === enterRole
  );
  if (welcomeEmployee) {
    localStorage.setItem("employee", JSON.stringify(welcomeEmployee));
  }
  return welcomeEmployee;
}

/* validation login */

submit.addEventListener("click", (e) => {
  e.preventDefault();
  let testEmail = validateEmail(valEmail.value, errorEmailSpace, errorEmailRegix);
  let testPassword = validatePassword(valPassword.value, errorPasswordSpace, errorPasswordChar);
  if (testEmail && testPassword) {

    fetch("../../assets/js/json/employee.json")
      .then(res => res.json())
      .then(employees => {
        if (getEmployee(employees, "Manager")) {
          window.location = "../../manager/manager.html";
        } else if (getEmployee(employees, "Employee")) {
          window.location = "../../employee/employee.html";
        } else if (getEmployee(employees, "Security")) {
          window.location = "../../security/security.html";
        } else if (getEmployee(employees, "HR")) {
          window.location = "../../admin/admin.html";
        }
        /* clear Data */
        clearData();

      })
      .catch(err => console.error(err));

  }

})





















