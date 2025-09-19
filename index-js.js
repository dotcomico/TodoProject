/// להוסיף פריורטי?
//להוסיף פופ אפ של הכרטיסיה?
// להוסיף אנימציות לכניסה ויציאה
// לעדכן נראות לפי םלקס בוקס
// להוסיף תמיכה של קישורים מספרים וכו


const btn = document.getElementById("addNoteBtn");
const resetForm = document.getElementById("reset-form");
const taskDiv = document.getElementById("new-task-div");
const taskForm = document.getElementById("new-task-form");
const colorPicker = document.getElementById("color-picker");
const textForm = document.getElementById("text-form");
const saveForm = document.getElementById("save-form");
const flexContainer = document.getElementById("flex-container");
const datePicker = document.getElementById("date-picker");
const timePicker = document.getElementById("time-picker");
const hading = document.getElementById("hading");
const historyBtn = document.getElementById("historyBtn");

let x;
let next = "red";
let r = 0;
let g = 0;
let b = 0;
let notes = [];
let history = [];
let colors = ["yellow", "green", "pink", "blue", "orange", "red"];
let colorCount = 0;


historyBtn.addEventListener('click', () => {

  document.querySelectorAll('.historyCard').forEach(card => card.remove());

  const historyCard = document.createElement('div');
  historyCard.className = 'historyCard';

  const title = document.createElement('p');
  title.textContent = 'History';
  historyCard.appendChild(title);
  historyCard.appendChild(document.createElement('hr'));

  
  history.forEach(note => {
    const item = document.createElement('div');
    item.className = 'note';


    let noteBgUrl = `images/notes/note-${note.color}.png`;
    item.style.backgroundImage = `url(${noteBgUrl})`;

    const mission = document.createElement('p');
    mission.textContent = note.mission;

    const date = document.createElement('div');
    date.textContent = note.date;

    const time = document.createElement('div');
    time.textContent = note.time;

    item.appendChild(mission);
    item.appendChild(date);
    item.appendChild(time);
    historyCard.appendChild(item);
  });

  document.body.appendChild(historyCard);
});

saveForm.addEventListener("mouseover", function () {
  startRandomColorChange2(saveForm);
});

saveForm.addEventListener("mouseleave", () => {
  clearInterval(x);
  saveForm.style.backgroundColor = "white";
});

saveForm.addEventListener("click", () => addNoteToView());

resetForm.addEventListener("mouseover", () => markForm());

resetForm.addEventListener("mouseleave", () => unMarkForm());

resetForm.addEventListener("click", () => {
  unMarkForm();
  textForm.style.backgroundColor = "white";
});



colorPicker.addEventListener("click", () => {
  if (colorCount === colors.length - 1) {
    colorCount = 0;
  } else {
    colorCount++;
  }
  console.log("clicked" + colorCount);
  colorPicker.style.backgroundColor = colors[colorCount];
});



function addNoteToView() {
  if (
    !textForm.value.trim() ||
    !datePicker.value.trim() ||
    !timePicker.value.trim()
  ) {
    return;
  }
  const noteId = Date.now();
  let newNote = {
    id: noteId,
    mission: textForm.value,
    date: datePicker.value,
    time: timePicker.value,
    color: colors[colorCount],
  };
  notes.push(newNote);
  console.log(notes);

  const newFlexItem = document.createElement("div");
  newFlexItem.className = "note";
  let noteBgUrl = `images/notes/note-${newNote.color}.png`;
  newFlexItem.style.backgroundImage = `url(${noteBgUrl})`;

  const deletIcon = document.createElement("i");
  deletIcon.className = "bi bi-x-square-fill";
  const paragraph = document.createElement("p");
  
  const dateDiv = document.createElement("div");
  const timeDiv = document.createElement("div");

  paragraph.innerHTML = textForm.value;
  dateDiv.innerHTML = datePicker.value;
  timeDiv.innerHTML = timePicker.value;

  deletIcon.addEventListener("click", () => {
    newFlexItem.remove();
    notes = notes.filter((note) => note.id !== noteId);
    console.log(notes);
    

    history.push(newNote);
    //הוספה של איבר לנראות היסטוריה
  });
  // newFlexItem.addEventListener('mouseover' , ()=>{
  //  deletIcon.style.visibility = 'hidden';
  // });
  // newFlexItem.addEventListener('mouseover' , ()=>{
  //  deletIcon.style.visibility = 'visible';
  // });

  newFlexItem.appendChild(deletIcon);
  newFlexItem.appendChild(paragraph);
  newFlexItem.appendChild(dateDiv);
  newFlexItem.appendChild(timeDiv);

  flexContainer.appendChild(newFlexItem);
}

function markForm() {
  taskForm.style.backgroundColor = "rgba(255, 0, 0, 0.45)";
}

function unMarkForm() {
  taskForm.style.backgroundColor = "rgba(255, 255, 255, 0)";
}

function startRandomColorChange() {
  x = setInterval(() => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    btn.style.backgroundColor = `rgb(${red} , ${green} , ${blue})`;
  }, 50);
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
