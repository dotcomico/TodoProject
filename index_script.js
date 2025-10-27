/// להוסיף פריורטי?
//להוסיף פופ אפ של הכרטיסיה?
// להוסיף אנימציות לכניסה ויציאה
// לעדכן נראות לפי םלקס בוקס
// להוסיף תמיכה של קישורים מספרים וכו

const btn = document.getElementById("addNoteBtn");
const resetForm = document.getElementById("reset-form");
const formContainer = document.getElementById("form-container");
const taskForm = document.getElementById("task-form");
const colorPicker = document.getElementById("color-picker");
const taskInput = document.getElementById("task-input");
const saveForm = document.getElementById("save-form");
const flexContainer = document.getElementById("flex-container");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const hading = document.getElementById("hading");
const historyBtn = document.getElementById("historyBtn");
const searchInput = document.getElementById("search-input");
const btnAll = document.getElementById("all");
const btnPending = document.getElementById("pending");
const btnCompleted = document.getElementById("completed");
const settingIcon = document.getElementById("setting-icon");
const sideBar = document.getElementById("side-bar");
const closeSideBarBtn = document.getElementById("close-side-bar-btn");
const mainBgSelect = document.getElementById("main-bg-select");
const formBgSelect = document.getElementById("form-bg-select");

const PATH = "images/backgrounds/";
let mainBackgrounds = [
  PATH + "corkboard.png",
  PATH + "grid-wide.png",
  PATH + "leaves.jpg",
  PATH + "machine.jpg",
  PATH + "wheat.jpg",
  PATH + "mountains.jpg",
  PATH + "garlic-dog.jpg",
];
let formBackgrounds = [
  PATH + "lines.png",
  PATH + "grid.png",
  PATH + "lights.jpg",
  PATH + "broadcast.jpg",
];
let mainBgCount = parseInt(localStorage.getItem("mainBgIndex")) || 0;
let formBgCount = parseInt(localStorage.getItem("formBgIndex")) || 0;
mainBgSelect.style.backgroundImage = `url(${mainBackgrounds[mainBgCount]})`;
formBgSelect.style.backgroundImage = `url(${formBackgrounds[formBgCount]})`;
setMainBackground();
setFormBackground();
let colorCount = 0;
let colors = ["yellow", "green", "pink", "blue", "orange", "red"];
let currentColor = 0;

for (let i = 0; i < colors.length; i++) {
  document.getElementById("c" + i).style.backgroundColor = colors[i];
  if (i === 0) {
    document.getElementById("c0").value = "✔";
  }

  document.getElementById("c" + i).addEventListener("click", (event) => {
    document.getElementById("c" + currentColor).value = "";
    event.target.value = "✔";
    currentColor = i;
  });
}

let currentFilter = "all"; // all/pending/completed
let currentSearch = "";

let x;
let next = "red";
let r = 0;
let g = 0;
let b = 0;

let notes = JSON.parse(localStorage.getItem("notes")) || [];

updateView();

taskForm.addEventListener("reset", (event) => {
  document.getElementById("c0").value = "✔";
  currentColor=0;
});

settingIcon.addEventListener("click", () => {
  sideBar.style.display = "block";
});

closeSideBarBtn.addEventListener("click", () => {
  sideBar.style.display = "none";
});

mainBgSelect.addEventListener("click", () => {
  if (mainBgCount >= mainBackgrounds.length - 1) {
    mainBgCount = 0;
  } else {
    mainBgCount++;
  }
  mainBgSelect.style.backgroundImage = `url(${mainBackgrounds[mainBgCount]})`;
  setMainBackground();
});

formBgSelect.addEventListener("click", () => {
  if (formBgCount >= formBackgrounds.length - 1) {
    formBgCount = 0;
  } else {
    formBgCount++;
  }
  formBgSelect.style.backgroundImage = `url(${formBackgrounds[formBgCount]})`;
  setFormBackground();
});

searchInput.addEventListener("input", (e) => handleSearch(e));
btnAll.addEventListener("click", (e) => setFilter("all", e));
btnPending.addEventListener("click", (e) => setFilter("pending", e));
btnCompleted.addEventListener("click", (e) => setFilter("completed", e));

saveForm.addEventListener("mouseover", function () {
  startRandomColorChange2(saveForm);
});

saveForm.addEventListener("mouseleave", () => {
  clearInterval(x);
  saveForm.style.backgroundColor = "white";
});

saveForm.addEventListener("click", () => {
  if (
    !taskInput.value.trim() ||
    !dateInput.value.trim() ||
    !timeInput.value.trim()
  ) {
    return;
  }

  const noteId = Date.now();
  let newNote = {
    id: noteId,
    task: taskInput.value,
    date: dateInput.value,
    time: timeInput.value,
    color: colors[currentColor],
    completed: false,
  };
  notes.push(newNote);
  console.log(notes);

  //  taskInput.value = "";
  // dateInput.value = "";
  // timeInput.value = "";
  currentFilter = "all";
  currentSearch = "";
  searchInput.value = "";

  btnAll.classList.add("active");
  btnPending.classList.remove("active");
  btnCompleted.classList.remove("active");
  // addNoteToView(newNote);  האם אפשר להשאיר את זה במקום השורה מתחת?

  updateView();
  saveNotesLocals();
});

resetForm.addEventListener("mouseover", () => markForm());

resetForm.addEventListener("mouseleave", () => unMarkForm());

resetForm.addEventListener("click", () => {
  unMarkForm();
  taskInput.style.backgroundColor = "white";
});

function saveNotesLocals() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
function handleSearch(event) {
  currentSearch = event.target.value.trim();
  updateView();
}

function setFilter(filterType, element) {
  btnAll.classList.remove("active");
  btnPending.classList.remove("active");
  btnCompleted.classList.remove("active");

  element.target.classList.add("active");

  currentFilter = filterType;
  updateView();
}

function getFilteredNotes() {
  let result = [...notes]; // העתק של המערך המקורי

  if (currentFilter === "pending") {
    result = result.filter((note) => !note.completed);
  } else if (currentFilter === "completed") {
    result = result.filter((note) => note.completed);
  }

  // חיפוש
  if (currentSearch !== "") {
    result = result.filter((note) =>
      note.task.toLowerCase().includes(currentSearch.toLowerCase())
    );
  }

  return result;
}

function updateView() {
  const filteredNotes = getFilteredNotes();

  flexContainer.innerHTML = "";
  filteredNotes.forEach((element) => {
    addNoteToView(element);
  });
}

function addNoteToView(note) {
  const newFlexItem = document.createElement("div");
  newFlexItem.className = "note";
  if (note.completed) {
    newFlexItem.classList.add("completed");
  }

  let noteBgUrl = `images/notes/note-${note.color}.png`;
  newFlexItem.style.backgroundImage = `url(${noteBgUrl})`;

  const deletIcon = document.createElement("i");
  deletIcon.className = "bi bi-x-square-fill";
  deletIcon.classList.add("delete-icon");

  const completeIcon = document.createElement("i");
  completeIcon.className = note.completed
    ? "bi bi-arrow-clockwise"
    : "bi bi-check-lg";
  completeIcon.classList.add("vi");
  const paragraph = document.createElement("p");
  if (note.completed) {
    paragraph.style.textDecoration = "line-through";
  }
  const dateDiv = document.createElement("div");
  const timeDiv = document.createElement("div");

  paragraph.innerHTML = note.task;
  dateDiv.innerHTML = note.date;
  timeDiv.innerHTML = note.time;

  deletIcon.addEventListener("click", () => {
    // newFlexItem.remove();   ??? במקום אפדייט וויו
    notes = notes.filter((n) => n.id !== note.id);
    console.log(notes);
    
    updateView();
    saveNotesLocals();
  });

  completeIcon.addEventListener("click", () => {
    let temp = !note.completed;
    note.completed = temp;
    updateView(); //?האם אפשר להוסיף קלאס של קומפליט במקום לעדכן הכל?
    saveNotesLocals();
  });

  newFlexItem.append(deletIcon, completeIcon, paragraph, dateDiv, timeDiv);
  flexContainer.appendChild(newFlexItem);
}

function markForm() {
  taskForm.style.backgroundColor = "rgba(255, 0, 0, 0.45)";
}

function unMarkForm() {
  taskForm.style.backgroundColor = "rgba(255, 255, 255, 0)";
}

function startRandomColorChange2(view) {
  clearInterval(x);

  x = setInterval(() => {
    if (next === "red") {
      r++;
      if (b > 0) {
        b--;
      }
    }
    if (next === "yellow") {
      g++;
      if (r > 0) {
        r--;
      }
    }
    if (next === "blue") {
      b++;
      if (g > 0) {
        g--;
      }
    }

    if (r === 255) {
      next = "yellow";
    }
    if (g === 255) {
      next = "blue";
    }
    if (b === 255) {
      next = "red";
    }

    view.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }, 1);
}
function setMainBackground() {
  document.body.style.backgroundImage = `url(${mainBackgrounds[mainBgCount]})`;
  localStorage.setItem("mainBgIndex", parseInt(mainBgCount));
}
function setFormBackground() {
  formContainer.style.backgroundImage = `url(${formBackgrounds[formBgCount]})`;
  localStorage.setItem("formBgIndex", parseInt(formBgCount));
}
