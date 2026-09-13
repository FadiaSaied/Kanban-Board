declare const bootstrap: any;
const taskNameInput = document.getElementById("task-name") as HTMLInputElement;
const taskLevelInput = document.getElementById(
  "selectLevel",
) as HTMLSelectElement;
const taskDateInput = document.getElementById("task-date") as HTMLInputElement;
const taskDesInput = document.getElementById(
  "message-text",
) as HTMLTextAreaElement;
const btnAdd = document.getElementById("add") as HTMLButtonElement;
const msgName = document.getElementById("msgName");
const msgDate = document.getElementById("msg");

const btnSave = document.getElementById("save") as HTMLButtonElement;
const todoCol = document.getElementById("todoTasks") as HTMLElement;
const progressCol = document.getElementById("progressTasks") as HTMLElement;
const completedCol = document.getElementById("completedTasks") as HTMLElement;
const tasksOfProgress = document.getElementById(
  "tasksOfProgress",
) as HTMLElement;

const tasksOfCompleted = document.getElementById(
  "tasksOfCompleted",
) as HTMLElement;

const tasksOfToDo = document.getElementById("tasksOfToDo") as HTMLElement;
const todoInfo = document.getElementById("todoInfo");
const progressInfo = document.getElementById("progressInfo");
const completedInfo = document.getElementById("completedInfo");
const successToast = document.getElementById("successToast") as HTMLElement;
const updateToast = document.getElementById("updateToast") as HTMLElement;

let currentIndex: number;
let today: Date = new Date();
let afterTwoDays: Date = new Date();
afterTwoDays.setDate(today.getDate() + 2);

interface Task {
  name: string;
  level: string;
  date: string;
  description: string;
  calcTime: string;
  status: "todo" | "progress" | "completed";
}

let collectedTasks: Task[] = [];
function createTask() {
  btnAdd.addEventListener("click", function () {
    if (validationTaskName() && validationDate()) {
      let task: Task = {
        name: taskNameInput.value,
        level: taskLevelInput.value,
        date: taskDateInput.value,
        description: taskDesInput.value,
        calcTime: new Date().toISOString(),
        status: "todo",
      };

      collectedTasks.push(task);
      const modalElement = document.getElementById("ModalTask") as HTMLElement;

      const modal = bootstrap.Modal.getInstance(modalElement);

      modal?.hide();
      const toast = new bootstrap.Toast(successToast);
      toast.show();
      displayTasks(collectedTasks);
      localStorage.setItem("task", JSON.stringify(collectedTasks));
      clearForm();
    }
  });
}
const savedTasks = localStorage.getItem("task");
if (savedTasks) {
  collectedTasks = JSON.parse(savedTasks);
  displayTasks(collectedTasks);
} else {
  collectedTasks = [];
}
createTask();
function displayTasks(arr: Task[]): void {
  let todayPlus: string | undefined = today.toISOString().split("T")[0];

  let after: string | undefined = afterTwoDays.toISOString().split("T")[0];

  let todoBox: string = "";
  let progressBox: string = "";
  let Completedbox: string = "";

  arr.forEach((task: Task, index: number) => {
    let box: string = ` <div class="col-12">
                  <div class="inner">
                    <div class="task cardTask">
                      <div
                        class="cardHeader d-flex justify-content-between align-items-center"
                      >
                        <div class="d-flex align-items-center gap-2">
                          <span class="ball ${
                            task.status === "todo"
                              ? "ballTodo"
                              : task.status === "progress"
                                ? "ballProgress"
                                : "ballCompleted"
                          }"
                                ></span>
                           <span class="index">#00${index + 1}</span>
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
                      <h3 class="${
                        task.status === "completed"
                          ? "text-decoration-line-through"
                          : ""
                      }">
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
    ${
      task.status === "completed"
        ? `
          <div class="done d-flex justify-content-center align-items-center gap-1">
            <span>
              <i class="fa-solid fa-check" style="color: #3db38f;"></i>
            </span>
            <span>Done</span>
          </div>
        `
        : task.date <= todayPlus!
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
          : task.date <= after!
            ? `<span class="duesoon badge">Due Soon</span>`
            : ``
    }
  </div>
</div>
                      <div
                        class="dataAndTime my-3 d-flex align-items-center gap-4" 
                      >
                        <div class="date d-flex align-items-center gap-1 " style="color: ${
                          task.date <= todayPlus!
                            ? "#FA2C36"
                            : task.date <= after!
                              ? "#FF6800"
                              : "#90A1B8"
                        }">
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
                        ${
                          task.status === "progress"
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
                                        `
                        }
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

function clearForm(): void {
  taskNameInput.value = "";
  taskLevelInput.value = "Medium";
  taskDateInput.value = "";
  taskDesInput.value = "";
}

function validationTaskName(): boolean {
  let text: string = taskNameInput.value;

  const regex = /^[A-Za-z ]{3,}$/;
  let corrected: boolean = regex.test(text);

  if (corrected) {
    msgName?.classList.add("d-none");
    taskNameInput.classList.remove("invalid");
    return true;
  } else {
    msgName?.classList.remove("d-none");
    taskNameInput.classList.add("invalid");
    return false;
  }
}

function keyboard(): void {
  taskNameInput.addEventListener("keydown", function (): void {
    msgName?.classList.add("d-none");
    taskNameInput.classList.remove("invalid");
  });
}

keyboard();

function validationDate(): boolean {
  let now = new Date().toISOString().split("T")[0]!;
  let taskDate = taskDateInput.value;
  if (taskDate === "") {
    return true;
  }
  if (taskDate >= now) {
    msgDate?.classList.add("d-none");
    taskDateInput?.classList.remove("invalid");

    return true;
  } else {
    msgDate?.classList.remove("d-none");
    taskDateInput?.classList.add("invalid");

    return false;
  }
}

function changeDate(): void {
  taskDateInput.addEventListener("change", function (): void {
    msgDate?.classList.add("d-none");
    taskDateInput.classList.remove("invalid");
  });
}

changeDate();

function formatDate(dateArabic: string): string {
  const day = new Date(dateArabic);

  return day.toDateString().split(" ").slice(1, 3).join(" ");
}

function getTimeAgo(calcTime: string): string {
  const now: number = Date.now();
  const timeAgo: number = new Date(calcTime).getTime();
  const number: number = now - timeAgo;

  const minutes: number = Math.floor(number / (1000 * 60));

  const hours: number = Math.floor(number / (1000 * 60 * 60));

  const days: number = Math.floor(number / (1000 * 60 * 60 * 24));

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

function deleteTask(i: number): void {
  collectedTasks.splice(i, 1);
  localStorage.setItem("task", JSON.stringify(collectedTasks));
  displayTasks(collectedTasks);
}

function setInfo(i: number): void {

  currentIndex = i;

  taskNameInput.value = collectedTasks[i]?.name!;
  taskLevelInput.value = collectedTasks[i]?.level!;
  taskDateInput.value = collectedTasks[i]?.date!;
  taskDesInput.value = collectedTasks[i]?.description!;
  const modalElement = document.getElementById("ModalTask") as HTMLElement;

  const modal = new bootstrap.Modal(modalElement);

  modal.show();
  btnAdd.classList.add("d-none");
  btnSave.classList.remove("d-none");
}

function UpdatedTask(): void {
  btnSave.addEventListener("click", function () {
    if (validationDate() && validationTaskName()) {
      let task: Task = {
        name: taskNameInput.value,
        level: taskLevelInput.value,
        date: taskDateInput.value,
        description: taskDesInput.value,
        calcTime: new Date().toISOString(),
        status: collectedTasks[currentIndex]!.status,
      };

      collectedTasks.splice(currentIndex, 1, task);
      clearForm();
      const modalElement = document.getElementById("ModalTask") as HTMLElement;

      const modal = bootstrap.Modal.getInstance(modalElement);

      modal?.hide();
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

function changeToProgress(i: number): void {
  collectedTasks[i]!.status = "progress";
  localStorage.setItem("task", JSON.stringify(collectedTasks));
  displayTasks(collectedTasks);
}

function changeToCompeleted(i: number): void {
  collectedTasks[i]!.status = "completed";
  localStorage.setItem("task", JSON.stringify(collectedTasks));
  displayTasks(collectedTasks);
}

function changeTodo(i: number): void {
  collectedTasks[i]!.status = "todo";
  localStorage.setItem("task", JSON.stringify(collectedTasks));
  displayTasks(collectedTasks);
}

function updateProgressCount(): void {
  let count: number = collectedTasks.filter(
    (task) => task.status === "progress",
  ).length;
  count === 0
    ? progressInfo?.classList.remove("d-none")
    : progressInfo?.classList.add("d-none");
  count === 1
    ? (tasksOfProgress.innerHTML = ` 1 Task `)
    : (tasksOfProgress.innerHTML = `  ${count} Tasks `);
}

function updateCompletesCount(): void {
  let count: number = collectedTasks.filter(
    (task) => task.status === "completed",
  ).length;
  count === 0
    ? completedInfo?.classList.remove("d-none")
    : completedInfo?.classList.add("d-none");
  count === 1
    ? (tasksOfCompleted.innerHTML = ` 1 Task `)
    : (tasksOfCompleted.innerHTML = `  ${count} Tasks `);
}

function updateTodoCount(): void {
  let count: number = collectedTasks.filter(
    (task) => task.status === "todo",
  ).length;
  count === 0
    ? todoInfo?.classList.remove("d-none")
    : todoInfo?.classList.add("d-none");
  count === 1
    ? (tasksOfToDo.innerHTML = ` 1 Task `)
    : (tasksOfToDo.innerHTML = `  ${count} Tasks `);
}
