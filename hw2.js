var EventEmitter = require('events');


class MyEmitter extends EventEmitter {};
var myEmitterObject = new MyEmitter();
myEmitterObject.on('timer', showTimeLeft);

var args = process.argv.slice(2);
var dates = [];

args.forEach(handleArgument);
dates.forEach(runTimer);


function handleArgument(givenDate, index) {
  var date = parseDate(givenDate);

  if (!date) {
    console.log(`Аргумент ${index + 1} неверного формата`);
    return;
  }

  if (date < new Date()) {
    console.log(`Дата ${givenDate} в прошлом`);
    return;
  } 

  dates.push({
    givenDate,
    date
  });
}

function parseDate(givenDate) {
  var regexDate = /^(0[0-9]|1[0-9]|2[0-3])-(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(20\d\d)$/;
  var matchArray = regexDate.exec(givenDate);

  if (matchArray !== null) {
    const hours = matchArray[1];
    const day = matchArray[2];
    const month = parseInt(matchArray[3]) - 1;
    const year = matchArray[4];

    return new Date(year, month, day, hours);
  }

  return null;
}


function runTimer(dateObj) {
  const intervalId = setInterval(function emitTimeEvent() {
    myEmitterObject.emit('timer', dateObj);
  }, 2000);
  dateObj.intervalId = intervalId;
}

function countTimeLeft(date) {
  var now = new Date();

  if (now > date) {
    return false;
  }

  var yearsLeft = date.getFullYear() - now.getFullYear();
  var monthsLeft = date.getMonth() - now.getMonth();
  var daysLeft = date.getDate() - now.getDate();
  var hoursLeft = date.getHours() - now.getHours();

  if (hoursLeft < 0) {
    daysLeft--;
    hoursLeft += 24;
  }

  if (daysLeft < 0) {
    monthsLeft--;
    const daysInMonth = getDaysInMonth(now.getMonth(), now.getFullYear());
    daysLeft += daysInMonth;
  }

  if (monthsLeft < 0) {
    yearsLeft--;
    monthsLeft += 12;
  }

  return {yearsLeft, monthsLeft, daysLeft, hoursLeft};
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function showTimeLeft({date, givenDate, intervalId}) {
  if (date > new Date()) {
    const {yearsLeft, monthsLeft, daysLeft, hoursLeft} = countTimeLeft(date)
    console.log(`До даты ${givenDate} осталось ${yearsLeft} лет, ${monthsLeft} месяцев, ${daysLeft} дней, ${hoursLeft} часов.`);
  } else {
    console.log(`Время до даты ${givenDate} прошло`);
    clearInterval(intervalId);
  }
}


