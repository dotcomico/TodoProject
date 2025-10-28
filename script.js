const addNoteBtn = document.getElementById("addNoteBtn");
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
//ניהול רקעים
const PATH = "images/backgrounds/";
let mainBackgrounds, formBackgrounds, colors;
let colorCount = 0;
let currentColor = 0;
let mainBgCount, formBgCount;
// סינון וחיפש ברירת מחדל
let currentFilter = "all"; // all/pending/completed
let currentSearch = "";

let colorChangeInterval;
let nextColor = "red";
let r = 0;
let g = 0;
let b = 0;

// שמות loacalStorage;
const notesData = "notes";
const mainBgData = "mainBgIndex";
const formBgData = "formBgIndex";
// קבלת רשימת פתקים שמורה
let notes = JSON.parse(localStorage.getItem(notesData)) || [];

updateArrays();
updateSettings();
updateColorButtons();
initColorButtonsLesteners();
updateNotesView();
handleListeners();

// פעולות ניהול
function initColorButtonsLesteners() {
  for (let i = 0; i < colors.length; i++) {
    // (במקום לקרוא לכל אחד בנפרד) שימוש בלולאה
    document.getElementById("c" + i).addEventListener("click", (event) => {
      document.getElementById("c" + currentColor).value = "";
      event.target.value = "✔";
      currentColor = i;
    });
  }
}
function updateColorButtons() {
  for (let i = 0; i < colors.length; i++) {
    // (במקום לקרוא לכל אחד בנפרד) שימוש בלולאה
    document.getElementById("c" + i).style.backgroundColor = colors[i];
    document.getElementById("c" + i).value = "";
  }
  document.getElementById("c0").value = "✔";
  currentColor = 0;
}
function updateArrays() {
  colors = ["yellow", "palegreen", "pink", "deepskyblue", "orange", "red"];

  // מערך רקעים
  mainBackgrounds = [
    PATH + "corkboard.png",
    PATH + "grid-wide.png",
    PATH + "leaves.jpg",
    PATH + "machine.jpg",
    PATH + "wheat.jpg",
    PATH + "garlic-dog.jpg",
  ];

  // מערך רקעי טופס
  formBackgrounds = [
    PATH + "lines.png",
    PATH + "grid.png",
    PATH + "lights.jpg",
    PATH + "broadcast.jpg",
  ];
}
function updateSettings() {
  //קבלת נתוני הגדרות שמורים
  mainBgCount = parseInt(localStorage.getItem(mainBgData)) || 0;
  formBgCount = parseInt(localStorage.getItem(formBgData)) || 0;
  //עדכון נראות
  mainBgSelect.style.backgroundImage = `url(${mainBackgrounds[mainBgCount]})`;
  formBgSelect.style.backgroundImage = `url(${formBackgrounds[formBgCount]})`;

  setMainBackground();
  setFormBackground();
}
function setMainBackground() {
  document.body.style.backgroundImage = `url(${mainBackgrounds[mainBgCount]})`;
  localStorage.setItem(mainBgData, parseInt(mainBgCount));
}
function setFormBackground() {
  formContainer.style.backgroundImage = `url(${formBackgrounds[formBgCount]})`;
  localStorage.setItem(formBgData, parseInt(formBgCount));
}
function handleListeners() {
  // האזנות בטופס
  taskForm.addEventListener("reset", () => updateColorButtons());
  saveForm.addEventListener("mouseover", () =>
    startRandomColorChange(saveForm)
  );

  saveForm.addEventListener("mouseleave", () => {
    clearInterval(colorChangeInterval);
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

    //איפוס קלט
    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";

    resetSearchBar();

    updateNotesView();
    saveNotesLocals();
  });
  resetForm.addEventListener("mouseover", () => markForm());
  resetForm.addEventListener("mouseleave", () => unMarkForm());

  resetForm.addEventListener("click", () => {
    unMarkForm();
    taskInput.style.backgroundColor = "white";
  });

  //האזנות בהגדרות
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

  //האזנות בחיפוש
  searchInput.addEventListener("input", (e) => handleSearch(e));
  btnAll.addEventListener("click", (e) => setFilter("all", e));
  btnPending.addEventListener("click", (e) => setFilter("pending", e));
  btnCompleted.addEventListener("click", (e) => setFilter("completed", e));
}

// פונקציות חיפוש וסינון
function resetSearchBar() {
  currentFilter = "all";
  currentSearch = "";
  searchInput.value = "";
  btnAll.classList.add("active");
  btnPending.classList.remove("active");
  btnCompleted.classList.remove("active");
}
function handleSearch(event) {
  currentSearch = event.target.value.trim();
  updateNotesView();
}
function setFilter(filterType, element) {
  btnAll.classList.remove("active");
  btnPending.classList.remove("active");
  btnCompleted.classList.remove("active");

  element.target.classList.add("active");

  currentFilter = filterType;
  updateNotesView();
}
function getFilteredNotes() {
  let filtereds = notes;

  if (currentFilter === "pending") {
    filtereds = filtereds.filter((note) => !note.completed);
  } else if (currentFilter === "completed") {
    filtereds = filtereds.filter((note) => note.completed);
  }

  if (currentSearch !== "") {
    filtereds = filtereds.filter((note) =>
      note.task.toLowerCase().includes(currentSearch.toLowerCase())
    );
  }

  return filtereds;
}

// פונקציות רשימת פתקים
function updateNotesView() {
  const filteredNotes = getFilteredNotes();
  flexContainer.innerHTML = "";
  if(filteredNotes.length === 0){
    flexContainer.textContent = '● Probably time to add some notes📝';
 } else {
    filteredNotes.forEach((element) => {
      addNoteToView(element);
    });
  }
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

  paragraph.textContent = note.task;
  dateDiv.textContent = note.date;
  timeDiv.textContent = note.time;

  deletIcon.addEventListener("click", () => {
    notes = notes.filter((n) => n.id !== note.id);
    console.log(notes);

    updateNotesView();
    saveNotesLocals();
  });

  completeIcon.addEventListener("click", () => {
    let temp = !note.completed;
    note.completed = temp;
    updateNotesView();
    saveNotesLocals();
  });

  newFlexItem.append(deletIcon, completeIcon, paragraph, dateDiv, timeDiv);
  flexContainer.appendChild(newFlexItem);
}
function saveNotesLocals() {
  localStorage.setItem(notesData, JSON.stringify(notes));
}

// פעולות טופס
function markForm() {
  taskForm.style.backgroundColor = "rgba(255, 0, 0, 0.45)";
}
function unMarkForm() {
  taskForm.style.backgroundColor = "rgba(255, 255, 255, 0)";
}

//כללי
function startRandomColorChange(view) {
  clearInterval(colorChangeInterval);

  colorChangeInterval = setInterval(() => {
    if (nextColor === "red") {
      r++;
      if (b > 0) {
        b--;
      }
    }
    if (nextColor === "yellow") {
      g++;
      if (r > 0) {
        r--;
      }
    }
    if (nextColor === "blue") {
      b++;
      if (g > 0) {
        g--;
      }
    }

    if (r === 255) {
      nextColor = "yellow";
    }
    if (g === 255) {
      nextColor = "blue";
    }
    if (b === 255) {
      nextColor = "red";
    }

    view.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }, 10);
}
