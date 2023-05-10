class Equation {
  constructor(unorderedEquation) {
    this.unorderedEquation = unorderedEquation
    this.letterList = [];
    this.results = unorderedEquation[unorderedEquation.length - 1];
  }
  orderVariables() {
    for (let i = 0; i < this.unorderedEquation.length - 1; i++) {
      const letter = this.unorderedEquation[i].match(/[^\d+\-.]/g).join("");
      const num = Number(this.unorderedEquation[i].match(/[\d+\-.]/g).join(""));
      if (this.letterList.includes(letter) == false) {
        this[letter] = num;
        this.letterList.push(letter);
      } else {
        this[letter] += num;
      }
    }
  }
}
class Matrix {
  constructor(matrix, results, variableOrder) {
    this.matrix = matrix;
    this.operatingMatrix = JSON.parse(JSON.stringify(matrix));
    this.size = matrix.length;
    this.results = results;
    this.determinantList = new Object();
    this.variableOrder = variableOrder;
  }
  getAllDeterminants() {
    this.calculateDeterminant("matrixDeterminant");
    for (let i = 0; i < this.size; i++) {
      this.operatingMatrix = JSON.parse(JSON.stringify(this.matrix));
      for (let j = 0; j < this.size; j++) {
        this.operatingMatrix[j].splice(i, 1, this.results[j]);
      }
      this.calculateDeterminant(this.variableOrder[i]);
    }
  }
  calculateDeterminant(det) {
    this.determinantList[det] = 0;
    if (this.size == 1) {
      this.determinantList.matrixDeterminant = 1;
      this.determinantList[det] = this.operatingMatrix[0][0] / this.matrix[0][0];
    } else if (this.size == 2) {
      const firstDiagonal = this.operatingMatrix[0][0] * this.operatingMatrix[1][1];
      const secondDiagonal = this.operatingMatrix[0][1] * this.operatingMatrix[1][0];
      this.determinantList[det] = firstDiagonal - secondDiagonal;
    } else {
      for (let i = 0; i < this.size; i++) {
        this.cofactor(i, det);
      }
    }
  }
  cofactor(n, det) {
    const bigMatrix = JSON.parse(JSON.stringify(this.operatingMatrix));
    bigMatrix.splice(0, 1);
    for (let j = 0; j < bigMatrix.length; j++) {
      bigMatrix[j].splice(n, 1);
    }
    const newMatrix = new Matrix(bigMatrix);
    newMatrix.calculateDeterminant(det);
    this.determinantList[det] += this.operatingMatrix[0][n] * (Math.pow(-1,1 + (n + 1)) * newMatrix.determinantList[det]);
  }
}