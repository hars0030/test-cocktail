window.addEventListener("DOMContentLoaded", init);
let searchBtn;
let userInput;
let divOutput = document.querySelector(".output");
let dialogCover = document.querySelector("#dialogCover");
let dialogClose = document.querySelector("#dialogClose");
let dialogTitle = document.querySelector("#dialogTitle");
let dialogSave = document.querySelector("#dialogSave");
let dialogDelete = document.querySelector("#dialogDelete");
let savedBtn = document.getElementById("savedBtn");
let savedOutput = document.querySelector(".savedOutput");
let globalScopeAllData = [];
let savedDataArray = [];
let dialogSaveId;
let DataId;
let match;

let key = "harsh-assignment-5";

let Url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

function init() {
  searchBtn = document.querySelector("#searchBtn");
  searchBtn.addEventListener("click", cocktailFetch);
  getData();
}

function getData() {
  let data = localStorage.getItem(key);
  if (data) {
    savedDataArray = JSON.parse(data);
    // console.log(data);
  } else {
    savedDataArray = [];
  }
}

function cocktailFetch() {
  dialogSave.classList.remove("hide");
  dialogDelete.classList.add("hide");
  savedOutput.classList.add("hide");
  divOutput.classList.remove("hide");
  userInput = document.querySelector("#userInput").value.trim();
  if (userInput) {
    fetch(Url + userInput)
      .then((response) => {
        if (!response.ok) {
          throw new Error("something is wrong");
        }
        return response.json();
      })
      .then((data) => {
        globalScopeAllData = data.drinks;

        displayCards();
      })
      .catch((err) => {
        divOutput.innerHTML = "";

        window.alert("no results found for " + userInput);
      });
  } else {
    console.log("userInput is empty");
    divOutput.innerHTML = "userInput is empty";
  }
  getData();
  dialogSave.addEventListener("click", saveFunc);
}

function displayCards() {
  divOutput.innerHTML = "";

  globalScopeAllData.forEach((item) => {
    drinksData = {
      strImage: item.strDrinkThumb,
      strName: item.strDrink,
      strId: item.idDrink,
      strInstructions: item.idDrink,
    };

    let divCard = document.createElement("div");
    divCard.setAttribute("data-id", drinksData.strId);

    divCard.className = "card";
    let title = document.createElement("h3");
    let Image = document.createElement("img");
    Image.src = drinksData.strImage;
    title.innerText = drinksData.strName;

    divCard.append(Image);
    divCard.append(title);
    divOutput.append(divCard);
  });

  divOutput.addEventListener("click", clickExecute);
}

function clickExecute(ev) {
  if (ev.target.closest(".card")) {
    console.log(ev.target.closest(".card"));
    DataId = ev.target.closest(".card").getAttribute("data-id");

    dialogCover.showModal();

    match = globalScopeAllData.find((item) => {
      return item.idDrink === DataId;
    });

    requiredItems = {
      name: match.strDrink,
      src: match.strDrinkThumb,
      instructions: match.strInstructions,
      id: match.idDrink,
    };

    dialogTitle.innerText = requiredItems.name;

    let image = document.getElementById("img");
    image.src = requiredItems.src;

    let instructionsEl = document.getElementById("instructions");
    instructionsEl.innerText = requiredItems.instructions;

    dialogSave.setAttribute("data-btnId", DataId);
    dialogSaveId = dialogSave.getAttribute("data-btnId");
  }
  dialogClose.addEventListener("click", function () {
    dialogCover.close();
    console.log(savedDataArray);
  });
}

function saveFunc(ev) {
  ev.preventDefault();

  if (!savedDataArray.includes(match)) {
    savedDataArray.push(match);
  }
  console.log(savedDataArray);

  saveData();
}

function saveData() {
  localStorage.setItem(key, JSON.stringify(savedDataArray));
}

savedBtn.addEventListener("click", savedBtnfunc);

function savedBtnfunc(ev) {
  dialogDelete.classList.remove("hide");
  dialogSave.classList.add("hide");
  console.log("display saved data running");
  savedOutput.classList.remove("hide");
  divOutput.classList.add("hide");
  savedOutput.innerHTML = "";

  savedDataArray.forEach((item) => {
    let divCard = document.createElement("div");
    divCard.setAttribute("data-id", item.idDrink);

    divCard.className = "card";
    let title = document.createElement("h3");
    let Image = document.createElement("img");
    Image.src = item.strDrinkThumb;
    title.innerText = item.strDrink;

    divCard.append(Image);
    divCard.append(title);
    savedOutput.append(divCard);
  });
  savedOutput.addEventListener("click", afunc);
}

function afunc(ev) {
  ev.preventDefault();
  if (ev.target.closest(".card")) {
    console.log(ev.target.closest(".card"));
    DataId = ev.target.closest(".card").getAttribute("data-id");

    dialogCover.showModal();

    match = savedDataArray.find((item) => {
      return item.idDrink === DataId;
    });

    requiredItems = {
      name: match.strDrink,
      src: match.strDrinkThumb,
      instructions: match.strInstructions,
      id: match.idDrink,
    };

    dialogTitle.innerText = requiredItems.name;

    let image = document.getElementById("img");
    image.src = requiredItems.src;

    let instructionsEl = document.getElementById("instructions");
    instructionsEl.innerText = requiredItems.instructions;

    dialogSave.setAttribute("data-btnId", DataId);
    dialogSaveId = dialogSave.getAttribute("data-btnId");
  }
  dialogSave.addEventListener("click", saveFunc);
  dialogClose.addEventListener("click", function () {
    dialogCover.close();
    console.log(savedDataArray);
  });
}

dialogDelete.addEventListener("click", deleteFunc);

function deleteFunc(ev) {
  ev.preventDefault();

  const index = savedDataArray.findIndex((item) => item.idDrink === DataId);

  if (index !== -1) {
    savedDataArray.splice(index, 1);
    saveData();
    dialogCover.close();
  }
}
