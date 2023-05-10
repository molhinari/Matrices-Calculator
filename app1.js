let currentApp = 1;
let onAnimation = false;
let stopErasing = false;
const equationArray = [];

document.addEventListener('keydown', function (event) {
  if (event.keyCode == 13 && event.target.nodeName == 'INPUT') {
    if (currentApp == 1) {
      addEquation();
    } else {
      let form = event.target.form;
      let index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  }
});

document.querySelectorAll(".app2").forEach(item => {
  item.className += " hide";
});

for (let i = 1; i < 3; i ++) {
  document.getElementById(`appButton${i}`).addEventListener("click", function() {
    changeApps(i);
  });
}

const DOMtitle = document.querySelector(".title");
const buttonAdd = document.querySelector(".add-equation");
const buttonCreateMatrix = document.querySelector(".create-matrix");
const equationInput = document.querySelector(".equation-input");
const equationList = document.querySelector(".equation-list");
const matrixList = document.querySelector(".results-list");
buttonAdd.addEventListener("click", addEquation);
buttonCreateMatrix.addEventListener("click", addMatrix);

function addEquation() {
  const newEquation = checkEquation(equationInput.value.toLowerCase()); 
  if (newEquation == "erro") {
    alert('Invalid equation!');
  } else {
    newEquation.orderVariables();
    equationArray.push(newEquation);
    const equationDiv = document.createElement("div");
    equationDiv.className = "equation-div";
    const equationToAdd = document.createElement("div");
    equationToAdd.innerText = equationInput.value;
    equationToAdd.className = "equation";
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-regular fa-trash-can";
    const deleteButton = document.createElement("span");
    deleteButton.className = "icon";
    deleteButton.addEventListener("click", function() {
      equationArray.splice(equationArray.indexOf(newEquation), 1);
      equationList.removeChild(equationDiv);
      checkDisabledButton();
      checkInstructions();
    });

    checkInstructions();
    deleteButton.appendChild(deleteIcon);
    equationDiv.appendChild(equationToAdd);
    equationDiv.appendChild(deleteButton);
    equationList.appendChild(equationDiv);
    checkDisabledButton();
    equationInput.value = "";
  }
}

function checkEquation(rawEquation) {
  if (rawEquation.match(/=/g) == null) {
    return "erro";
  }
  rawEquation = rawEquation.replaceAll(',', '.');
  const equation = rawEquation.split(/[\s\+\-=]+/);
  const equationSignals = rawEquation.split(/[\d\w\s=.]+/);
  console.log(equation, equationSignals);
  for (let i = 0; i < equation.length; i++) {
    if (i !== equation.length - 1) {
      if (equation[i].match(/\d+/g) == null) {
        equation[i] = `1${equation[i]}`
      }
      if (equation[i].match(/\D/g) == null) {
        return "erro";
      }
    }
    if (equationSignals[i] == "-") {
      const numToReplace = equation[i].split("");
      numToReplace.unshift("-");
      equation[i] = numToReplace.join("");
    }
  }
  return new Equation(equation);
}

function addMatrix() {
  const mainMatrix = createMatrix();
  mainMatrix.getAllDeterminants();
  printResults(mainMatrix);
}

function createMatrix() {
  const variableOrder = getVariableOrder(equationArray);
  const matrixArr = [];
  const resultsArr = [];
  let equationToPush = [];
  for (let i = 0; i < equationArray.length; i++) {
    equationToPush = [];
    for (let j = 0; j < variableOrder.length; j++) {
      if (equationArray[i][variableOrder[j]] == undefined) {
        equationToPush.push(0);
      } else {
        equationToPush.push(equationArray[i][variableOrder[j]]);
      }
    }
    resultsArr.push(Number(equationArray[i].results));
    matrixArr.push(equationToPush);
  }
  return new Matrix(matrixArr, resultsArr, getVariableOrder(equationArray));
}

function getVariableOrder(equations) {
  const variableOrder = [];
  for (let i = 0; i < equations.length; i++) {
    for (let j = 0; j < equations[i].letterList.length; j++) {
      if (variableOrder.includes(equations[i].letterList[j]) == false) {
        variableOrder.push(equations[i].letterList[j]);
      }
    }
  }
  return variableOrder;
}

function checkDisabledButton() {
  const variableOrder = getVariableOrder(equationArray);
  if (variableOrder.length == equationArray.length && variableOrder.length > 0) {
    buttonCreateMatrix.disabled = false;
  } else {
    buttonCreateMatrix.disabled = true;
  }
}

function checkInstructions() {
  const instructions = document.querySelector('.instructions');
  instructions.className = equationArray.length > 0 ? "instructions hide" : "instructions";
}

function printResults(matrix) {
  const variableOrder = getVariableOrder(equationArray);
  const matrixDiv = document.createElement("div");
  matrixDiv.className = "bigger-div";
  const equationsDiv = document.createElement("div");
  equationsDiv.className = "equations-div";
  const resultsDiv = document.createElement("div");
  resultsDiv.className = "results-div";
  const newEquations = document.querySelectorAll(".equation");
  const hr = document.createElement("hr");
  const verticalHr = document.createElement("div");
  verticalHr.className = "vertical-hr has-background-dark";
  newEquations.forEach(equ => {
    let newEqu = document.createElement("div");
    newEqu.innerText = equ.innerText;
    newEqu.className = "bottom-equation";
    equationsDiv.appendChild(newEqu);
  });
  
  let matrixType = "SPD";
  for (let i = 0; i < variableOrder.length; i++) {
    let newResultValue = matrix.determinantList[variableOrder[i]] / matrix.determinantList.matrixDeterminant;
    let newResultDiv = document.createElement("div");

    let newResult = document.createElement("span");
    let newResultVariable = document.createElement("span");

    newResultVariable.className = "result-variable has-text-primary";
    newResultVariable.innerText = `${variableOrder[i]}`;

    newResult.innerText =  ` = ${parseFloat(newResultValue.toFixed(2))}`;
    if (isNaN(newResultValue)) {
      if (matrixType != "Inconsistent equation system") {
      matrixType = "Dependent equation system";
      }
    } else if (newResultValue == "Infinity" || newResultValue == "-Infinity") {
      matrixType = "Inconsistent equation system";
    } else {
    newResultDiv.appendChild(newResultVariable);
    newResultDiv.appendChild(newResult);
    resultsDiv.appendChild(newResultDiv);
    }
  }
  if (matrixType != "SPD") {
    const matrixTypeWarning = document.createElement("div");
    matrixTypeWarning.innerText = matrixType;
    resultsDiv.appendChild(matrixTypeWarning);
    }

  const deleteResultsButton = document.createElement("span");
  deleteResultsButton.className = "icon is-small has-text-danger delete-results";
  const buttonIcon = document.createElement("i");
  buttonIcon.className = "fa-solid fa-xmark";
  deleteResultsButton.addEventListener("click", function() {
    matrixList.removeChild(matrixDiv);
    matrixList.removeChild(hr);
  });
  deleteResultsButton.appendChild(buttonIcon);

  matrixDiv.appendChild(equationsDiv);
  //matrixDiv.appendChild(verticalHr);
  matrixDiv.appendChild(resultsDiv);
  matrixDiv.appendChild(deleteResultsButton);
  matrixList.appendChild(matrixDiv);
  matrixList.appendChild(hr);
}

function changeApps(appNumber) {
  if (appNumber !== currentApp && onAnimation == false) {
    onAnimation = true;
    changeOutline(appNumber);
    const itemsToHide = document.querySelectorAll(`.app${currentApp}`);
    itemsToHide.forEach(item => {
      item.className += " hide";
    });
    const itemsToShow = document.querySelectorAll(`.app${appNumber}`);
    itemsToShow.forEach(item => {
      item.className = item.className.slice(0, -5);
    })
    currentApp = appNumber;
    changeTitle();
  }
}

function changeTitle() {
  let newTitle;
  let oldTitle = DOMtitle.innerText;
  if (currentApp == 1) {
    newTitle = "Equation systems";
  } else {
    newTitle = "Matrices";
  }
  eraseTitle(oldTitle, 0);
  setTimeout(function() {
    if (DOMtitle.innerText.length != 0) {
      stopErasing = true;
      DOMtitle.innerText = "";
    };
    typeTitle(newTitle, 0);
  } , (oldTitle.length * 30));
  setTimeout(function() {
    onAnimation = false
  }, (oldTitle.length + newTitle.length) * 30)
}

function eraseTitle(oldTitle, count) {
  if (count < oldTitle.length) {
    setTimeout(function() { 
        if (stopErasing == true) {
          stopErasing = false;
          return;
        }
        DOMtitle.innerText = DOMtitle.innerText.slice(0, -1);
        count++
        eraseTitle(oldTitle, count);
    }, 15);
  }
}

function typeTitle(title, count) {
  if (count < title.length) {
    setTimeout(function() { 
        DOMtitle.innerText += title[count];
        count++;
        typeTitle(title, count);
    }, 20);
  }
}

function changeOutline(appNumber) {
  document.getElementById(`appButton${currentApp}`).name += "-outline";
  let nameToErase = document.getElementById(`appButton${appNumber}`).name;
  document.getElementById(`appButton${appNumber}`).name = nameToErase.slice(0, nameToErase.length-8);
  document.querySelector(`.button-app${appNumber}`).className += " has-text-primary";
  let classNameToChange = document.querySelector(`.button-app${currentApp}`).className;
  document.querySelector(`.button-app${currentApp}`).className = classNameToChange.slice(0, classNameToChange.length-16);
}