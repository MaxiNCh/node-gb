var colors = require('colors');

var args = process.argv.slice(2);
var colorsList = ['green', 'yellow', 'red'];
var printColorNumber = setColors(colorsList);

printPrimeNumbers(args[0], args[1]);

function printPrimeNumbers(min, max) {
  min = parseInt(min);
  max = parseInt(max);

  if (!checkArguments(min, max)) {
    return;
  }

  var currentNumber = min > 1 ? min : 2;
  var primeNumberExists = false;

  while (currentNumber <= max) {
    if (checkIfNumberIsPrime(currentNumber)) {
      printColorNumber(currentNumber);
      primeNumberExists = true;
    }
    currentNumber++;
  }

  if (!primeNumberExists) {
    printError('Нет простых чисел в диапазоне');
  }
}

function checkArguments(min, max) {
  if (!Number.isInteger(min)) {
    printError('Введено некорректное минимальное число');
    return false;
  }

  if (!Number.isInteger(max)) {
    printError('Введено некорректное максимальное число');
    return false;
  }

  if (min > max) {
    printError('Минимальное число не должно быть больше максимального');
    return false;
  }

  if (max < 2) {
    printError('Нет простых чисел в диапазоне');
    return false;
  }

  return true;
}

function setColors(colorsList) {
  var i = 0;

  return function printNumber(number) {
    i = i % colorsList.length;
    const currentColor = colorsList[i];
    console.log(colors[currentColor](number));
    i++;
  }
}

function checkIfNumberIsPrime(number) {
  if (!Number.isInteger(number) || number < 2) {
    return false;
  }

  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

function printError(msg) {
  console.log(colors.red(msg));
}
