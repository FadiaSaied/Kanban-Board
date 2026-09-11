const taskNameInput = document.getElementById("task-name");
const taskLevelInput = document.getElementById("selectLevel");
const taskDateInput = document.getElementById("task-date");
const taskDesInput = document.getElementById("message-text");
const btnAdd = document.getElementById("add");
const msgName = document.getElementById("msgName");
const msgDate = document.getElementById("msg");
const btnSave = document.getElementById("save");
const todoCol = document.getElementById("todoTasks");
const progressCol = document.getElementById("progressTasks");
const completedCol = document.getElementById("completedTasks");
const tasksOfProgress = document.getElementById("tasksOfProgress");
const tasksOfCompleted = document.getElementById("tasksOfCompleted");
const tasksOfToDo = document.getElementById("tasksOfToDo");
const todoInfo = document.getElementById("todoInfo");
const progressInfo = document.getElementById("progressInfo");
const completedInfo = document.getElementById("completedInfo");
const successToast = document.getElementById("successToast");
const updateToast = document.getElementById("updateToast");
let currentIndex;
let today = new Date();
let afterTwoDays = new Date();
afterTwoDays.setDate(today.getDate() + 2);
let collectedTasks = [];
function createTask() {
    btnAdd.addEventListener("click", function () {
        if (validationTaskName() && validationDate()) {
            let task = {
                name: taskNameInput.value,
                level: taskLevelInput.value,
                date: taskDateInput.value,
                description: taskDesInput.value,
                calcTime: new Date().toISOString(),
                status: "todo",
            };
            console.log(task.calcTime);
            collectedTasks.push(task);
            const modalElement = document.getElementById("ModalTask");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal === null || modal === void 0 ? void 0 : modal.hide();
            const toast = new bootstrap.Toast(successToast);
            toast.show();
            displayTasks(collectedTasks);
            localStorage.setItem("task", JSON.stringify(collectedTasks));
            console.log(collectedTasks);
            clearForm();
        }
    });
}
const savedTasks = localStorage.getItem("task");
if (savedTasks) {
    collectedTasks = JSON.parse(savedTasks);
    displayTasks(collectedTasks);
}
else {
    collectedTasks = [];
}
createTask();
function displayTasks(arr) {
    let todayPlus = today.toISOString().split("T")[0];
    let after = afterTwoDays.toISOString().split("T")[0];
    let todoBox = "";
    let progressBox = "";
    let Completedbox = "";
    arr.forEach((task, index) => {
        let box = ` <div class="col-12">
                  <div class="inner">
                    <div class="task cardTask">
                      <div
                        class="cardHeader d-flex justify-content-between align-items-center"
                      >
                        <div class="d-flex align-items-center gap-2">
                          <span class="ball ${task.status === "todo"
            ? "ballTodo"
            : task.status === "progress"
                ? "ballProgress"
                : "ballCompleted"}"
                                ></span>
                           <span class="index">#00${index}</span>
                          </div>
                        <div
                          class="btnsCard d-flex align-items-center flex-wrap gap-1"
                        >
                          <div
                            class="btnPen d-flex justify-content-center align-items-center"
                          >
                            <button type="button" class="update" onclick="setInfo(${index})">
                              <i class="fa-solid fa-pen"></i>
                            </button>
                          </div>
                          <div
                            class="btnTrach d-flex justify-content-center align-items-center"
                          >
                            <button type="button" class="delete" onclick="deleteTask(${index})">
                              <i class="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <h3 class="${task.status === "completed"
            ? "text-decoration-line-through"
            : ""}">
                        ${task.name}
                       </h3>
                     <span class="notes">${task.description}</span>
                     <div
  class="priority mt-3 d-flex align-items-center gap-3 flex-wrap"
>
  <div>
    <div
      class="${task.level} badge priorityCard d-flex align-items-center gap-1"
    >
      <span class="ball ball${task.level}"></span>

      <span class="name">
        ${task.level === "High" ? `${task.level} Priority` : task.level}
      </span>
    </div>
  </div>

  <div>
    ${task.status === "completed"
            ? `
          <div class="done d-flex justify-content-center align-items-center gap-1">
            <span>
              <i class="fa-solid fa-check" style="color: #3db38f;"></i>
            </span>
            <span>Done</span>
          </div>
        `
            : task.date <= todayPlus
                ? `
            <div class="overdue d-flex justify-content-center align-items-center gap-1">
              <span>
                <i
                  class="fa-solid fa-triangle-exclamation"
                  style="color: #e6000b"
                ></i>
              </span>
              <span class="over">Overdue</span>
            </div>
          `
                : task.date <= after
                    ? `<span class="duesoon badge">Due Soon</span>`
                    : ``}
  </div>
</div>
                      <div
                        class="dataAndTime my-3 d-flex align-items-center gap-4" 
                      >
                        <div class="date d-flex align-items-center gap-1 " style="color: ${task.date <= todayPlus
            ? "#FA2C36"
            : task.date <= after
                ? "#FF6800"
                : "#90A1B8"}">
                          <span><i class="fa-regular fa-calendar"></i></span>
                          <span>${formatDate(task.date)}</span>
                        </div>
                        <div class="time d-flex align-items-center gap-1">
                          <span
                            ><i
                              class="fa-regular fa-clock"
                              style="color: #8fa0b8"
                            ></i
                          ></span>
                          <span>${getTimeAgo(task.calcTime)}</span>
                        </div>
                      </div>
                      
                      <div
                        class="btnsFooter d-flex align-items-center gap-2 flex-wrap"
                      >
                        ${task.status === "progress"
            ? `
                              <div class="todo d-flex align-items-center">
                                <i
                                  class="fa-solid fa-arrow-rotate-left"
                                  style="color: #314057;"
                                ></i>

                                <button
                                  type="button"
                                  class="btnTodo"
                                  onclick="changeToTOdo(${index})"
                                >
                                  To Do
                                </button>
                              </div>

                              <div class="complete d-flex align-items-center">
                                <span>
                                  <i
                                    class="fa-solid fa-check"
                                                                style="color: #01805c"
                                      ></i>
                                    </span>

                                    <button
                                      type="button"
                                      class="btnComplete"
                                      onclick="changeToCompeleted(${index})"
                                    >
                                      Complete
                                    </button>
                                  </div>
                                `
            : task.status === "completed"
                ? `
                                    <div class="start d-flex align-items-center">
                                      <span>
                                        <i
                                          class="fa-solid fa-play"
                                          style="color: #b84d00"
                                        ></i>
                                      </span>

                                      <button
                                        type="button"
                                        class="btnStart"
                                        onclick="changeToProgress(${index})"
                                                                            >
                                                  Start
                                                </button>
                                              </div>

                                              <div class="todo d-flex align-items-center">
                                                <i
                                                  class="fa-solid fa-arrow-rotate-left"
                                                  style="color: #314057;"
                                                ></i>

                                                <button
                                                  type="button"
                                                  class="btnTodo"
                                                  onclick="changeTodo(${index})"
                                                >
                                                  To Do
                                                </button>
                                              </div>
                                            `
                : `
                                          <div class="start d-flex align-items-center">
                                            <span>
                                              <i
                                                class="fa-solid fa-play"
                                                style="color: #b84d00"
                                              ></i>
                                            </span>

                                            <button
                                              type="button"
                                              class="btnStart"
                                              onclick="changeToProgress(${index})"
                                            >
                                              Start
                                            </button>
                                          </div>

                                          <div class="complete d-flex align-items-center">
                                            <span>
                                              <i
                                                class="fa-solid fa-check"
                                                style="color: #01805c"
                                              ></i>
                                            </span>

                                            <button
                                              type="button"
                                              class="btnComplete"
                                              onclick="changeToCompeleted(${index})"
                                            >
                                              Complete
                                            </button>
                                          </div>
                                        `}
                      </div>
                    </div>
                  </div>
                </div>`;
        if (task.status === "todo") {
            todoBox += box;
        }
        if (task.status === "progress") {
            progressBox += box;
        }
        if (task.status === "completed") {
            Completedbox += box;
        }
    });
    todoCol.innerHTML = todoBox;
    progressCol.innerHTML = progressBox;
    completedCol.innerHTML = Completedbox;
    updateProgressCount();
    updateCompletesCount();
    updateTodoCount();
}
function clearForm() {
    taskNameInput.value = "";
    taskLevelInput.value = "Medium";
    taskDateInput.value = "";
    taskDesInput.value = "";
}
function validationTaskName() {
    let text = taskNameInput.value;
    const regex = /^[A-Za-z ]{3,}$/;
    let corrected = regex.test(text);
    if (corrected) {
        msgName === null || msgName === void 0 ? void 0 : msgName.classList.add("d-none");
        taskNameInput.classList.remove("invalid");
        return true;
    }
    else {
        msgName === null || msgName === void 0 ? void 0 : msgName.classList.remove("d-none");
        taskNameInput.classList.add("invalid");
        return false;
    }
}
function keyboard() {
    taskNameInput.addEventListener("keydown", function () {
        msgName === null || msgName === void 0 ? void 0 : msgName.classList.add("d-none");
        taskNameInput.classList.remove("invalid");
    });
}
keyboard();
function validationDate() {
    let now = new Date().toISOString().split("T")[0];
    let taskDate = taskDateInput.value;
    if (taskDate === "") {
        return true;
    }
    if (taskDate >= now) {
        msgDate === null || msgDate === void 0 ? void 0 : msgDate.classList.add("d-none");
        taskDateInput === null || taskDateInput === void 0 ? void 0 : taskDateInput.classList.remove("invalid");
        return true;
    }
    else {
        msgDate === null || msgDate === void 0 ? void 0 : msgDate.classList.remove("d-none");
        taskDateInput === null || taskDateInput === void 0 ? void 0 : taskDateInput.classList.add("invalid");
        return false;
    }
}
function changeDate() {
    taskDateInput.addEventListener("change", function () {
        msgDate === null || msgDate === void 0 ? void 0 : msgDate.classList.add("d-none");
        taskDateInput.classList.remove("invalid");
    });
}
changeDate();
function formatDate(dateArabic) {
    const day = new Date(dateArabic);
    return day.toDateString().split(" ").slice(1, 3).join(" ");
}
function getTimeAgo(calcTime) {
    const now = Date.now();
    const timeAgo = new Date(calcTime).getTime();
    const number = now - timeAgo;
    const minutes = Math.floor(number / (1000 * 60));
    const hours = Math.floor(number / (1000 * 60 * 60));
    const days = Math.floor(number / (1000 * 60 * 60 * 24));
    if (minutes < 1) {
        return "Just now";
    }
    if (minutes < 60) {
        return minutes === 1 ? "1m ago" : `${minutes}m ago`;
    }
    if (hours < 24) {
        return hours === 1 ? `1h ago` : `${hours}h ago`;
    }
    return days === 1 ? `1d ago` : `${days}d ago`;
}
function deleteTask(i) {
    collectedTasks.splice(i, 1);
    localStorage.setItem("task", JSON.stringify(collectedTasks));
    displayTasks(collectedTasks);
}
function setInfo(i) {
    var _a, _b, _c, _d;
    console.log(i);
    currentIndex = i;
    taskNameInput.value = (_a = collectedTasks[i]) === null || _a === void 0 ? void 0 : _a.name;
    taskLevelInput.value = (_b = collectedTasks[i]) === null || _b === void 0 ? void 0 : _b.level;
    taskDateInput.value = (_c = collectedTasks[i]) === null || _c === void 0 ? void 0 : _c.date;
    taskDesInput.value = (_d = collectedTasks[i]) === null || _d === void 0 ? void 0 : _d.description;
    const modalElement = document.getElementById("ModalTask");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    btnAdd.classList.add("d-none");
    btnSave.classList.remove("d-none");
}
function UpdatedTask() {
    btnSave.addEventListener("click", function () {
        if (validationDate() && validationTaskName()) {
            let task = {
                name: taskNameInput.value,
                level: taskLevelInput.value,
                date: taskDateInput.value,
                description: taskDesInput.value,
                calcTime: new Date().toISOString(),
                status: collectedTasks[currentIndex].status,
            };
            collectedTasks.splice(currentIndex, 1, task);
            clearForm();
            const modalElement = document.getElementById("ModalTask");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal === null || modal === void 0 ? void 0 : modal.hide();
            const toast = new bootstrap.Toast(updateToast);
            toast.show();
            localStorage.setItem("task", JSON.stringify(collectedTasks));
            btnAdd.classList.remove("d-none");
            btnSave.classList.add("d-none");
            displayTasks(collectedTasks);
        }
    });
}
UpdatedTask();
function changeToProgress(i) {
    collectedTasks[i].status = "progress";
    localStorage.setItem("task", JSON.stringify(collectedTasks));
    displayTasks(collectedTasks);
}
function changeToCompeleted(i) {
    collectedTasks[i].status = "completed";
    localStorage.setItem("task", JSON.stringify(collectedTasks));
    displayTasks(collectedTasks);
}
function changeTodo(i) {
    collectedTasks[i].status = "todo";
    localStorage.setItem("task", JSON.stringify(collectedTasks));
    displayTasks(collectedTasks);
}
function updateProgressCount() {
    let count = collectedTasks.filter((task) => task.status === "progress").length;
    count === 0
        ? progressInfo === null || progressInfo === void 0 ? void 0 : progressInfo.classList.remove("d-none")
        : progressInfo === null || progressInfo === void 0 ? void 0 : progressInfo.classList.add("d-none");
    count === 1
        ? (tasksOfProgress.innerHTML = ` 1 Task `)
        : (tasksOfProgress.innerHTML = `  ${count} Tasks `);
}
function updateCompletesCount() {
    let count = collectedTasks.filter((task) => task.status === "completed").length;
    count === 0
        ? completedInfo === null || completedInfo === void 0 ? void 0 : completedInfo.classList.remove("d-none")
        : completedInfo === null || completedInfo === void 0 ? void 0 : completedInfo.classList.add("d-none");
    count === 1
        ? (tasksOfCompleted.innerHTML = ` 1 Task `)
        : (tasksOfCompleted.innerHTML = `  ${count} Tasks `);
}
function updateTodoCount() {
    let count = collectedTasks.filter((task) => task.status === "todo").length;
    count === 0
        ? todoInfo === null || todoInfo === void 0 ? void 0 : todoInfo.classList.remove("d-none")
        : todoInfo === null || todoInfo === void 0 ? void 0 : todoInfo.classList.add("d-none");
    count === 1
        ? (tasksOfToDo.innerHTML = ` 1 Task `)
        : (tasksOfToDo.innerHTML = `  ${count} Tasks `);
}
