const squaresDiv = document.querySelector(".squares-div");

for (let i = 0; i < 3; i++) {
  const newRow = document.createElement("div");
  newRow.className = "row";
  for (let j = 0; j < 3; j++) {
    const squareToAdd = document.createElement("input");
    squareToAdd.className = "input matrix-square";
    squareToAdd.type="number";
    newRow.appendChild(squareToAdd);
  }
  squaresDiv.appendChild(newRow);
}

let numberOfSquares = document.querySelectorAll(".row").length;

document.querySelector(".plus").addEventListener("click", function() {
  if (numberOfSquares < 8) addSquares();
});
document.querySelector(".minus").addEventListener("click", function() {
  if (numberOfSquares > 2) deleteSquares();
});
document.querySelector(".resolve-matrix").addEventListener("click", resolveMatrix);

function addSquares() {
  numberOfSquares++;
  document.querySelectorAll(".row").forEach(row => {
    const squareToAdd = document.createElement("input");
    squareToAdd.className = "input matrix-square";
    squareToAdd.type="number";
    row.appendChild(squareToAdd);
  });
  
  const newRow = document.createElement("div");
  newRow.className = "row";
  for (let i = 0; i < numberOfSquares; i++) {
    const newSquare = document.createElement("input");
    newSquare.className = "input matrix-square";
    newSquare.type="number";
    newRow.appendChild(newSquare);
  }
  squaresDiv.appendChild(newRow);
}

function deleteSquares() {
  document.querySelectorAll(".row").forEach(row => {
    const squareList = [...row.childNodes];
    row.removeChild(squareList[squareList.length - 1]);
  });
  const rowsList = [...squaresDiv.childNodes];
  squaresDiv.removeChild(rowsList[rowsList.length - 1]);
  numberOfSquares--;
}

function resolveMatrix() {
  const matrixToResolve = returnMatrix();
  matrixToResolve.calculateDeterminant("matrixDeterminant");
  printMatrix(matrixToResolve);
}

function returnMatrix() {
  const matrixArray = [];
  document.querySelectorAll(".row").forEach(row => {
    const rowToPush = [];
    row.childNodes.forEach(input => {
      if (input.value !== undefined) {
      rowToPush.push(Number(input.value));
      input.value = "";
      }
    });
    matrixArray.push(rowToPush);
  });
  return new Matrix(matrixArray);
}

function printMatrix(matrix) {
  const biggerDiv = document.createElement("div");
  biggerDiv.className = "bigger-div";
  const matrixDiv = document.createElement("div");
  matrixDiv.className = "matrix-div";
  const determinantDiv = document.createElement("div");
  determinantDiv.className = "determinant-div";
  determinantDiv.innerText = `det = ${matrix.determinantList.matrixDeterminant}`;
  const anotherVerticalHr = document.createElement("div");
  anotherVerticalHr.className = "vertical-hr has-background-dark";
  const verticalHrClone = anotherVerticalHr.cloneNode(true);
  const matrixNumbers = document.createElement("div");
  matrixNumbers.className = "matrix-numbers";
  matrix.matrix.forEach(row => {
    const matrixRow = row.join(' ');
    const rowDiv = document.createElement("div");
    rowDiv.innerText = matrixRow;
    matrixNumbers.appendChild(rowDiv);
  });
  
  let listToAppend = document.querySelector('.matrix-list');
  let hr = document.createElement("hr");
  
  const deleteResultsButton = document.createElement("span");  deleteResultsButton.className = "icon is-small has-text-danger delete-results";
  const buttonIcon = document.createElement("i");
  buttonIcon.className = "fa-solid fa-xmark";
  deleteResultsButton.addEventListener("click", function() {
    listToAppend.removeChild(biggerDiv);
    listToAppend.removeChild(hr);
  });
  deleteResultsButton.appendChild(buttonIcon);
   
   matrixDiv.appendChild(anotherVerticalHr);
   matrixDiv.appendChild(matrixNumbers);
   matrixDiv.appendChild(verticalHrClone);
   biggerDiv.appendChild(matrixDiv);
   biggerDiv.appendChild(determinantDiv);
   biggerDiv.appendChild(deleteResultsButton);
   listToAppend.appendChild(hr);
   listToAppend.appendChild(biggerDiv);
}