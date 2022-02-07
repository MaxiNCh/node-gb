const fs = require('fs');

const ipAddresses = ['89.123.1.41', '34.48.240.111'];
const getWriteStream = createWriteStreams();

const readStream = fs.createReadStream('./access.log', {
  encoding: 'utf8',
});


{
  // Переменная для сохранения неполных строк
  var bufferString = '';

  readStream.on('data', function processChunk(chunk) {
    const stringsArray = chunk.split('\n');

    // Если была сохранена неполная строка, то добавляем в начало первой строки
    if (bufferString !== '') {
      stringsArray[0] = bufferString + stringsArray[0];
      bufferString = '';
    }

    // Если последняя строка неполная, сохраняем в буфер
    if (!stringsArray[stringsArray.length - 1].includes('\n')) {
      bufferString = stringsArray.pop();
    }

    // Проверяем ip у лога, и записываем в соответствующий файл
    stringsArray.forEach((log) => {
      ipAddresses.forEach((ip) => {
        if (log.includes(ip)) {
          getWriteStream(ip).write(log + '\n');
        }
      });
    });
  });

  readStream.on('error', function (err) {
    console.error(err);
  });
  readStream.on('end', () => console.log('File has been read.'));
}

// Создаем стримы для записи
function createWriteStreams() {
  const writeStreams = new Map();

  return function getWriteStreamInstance(ip) {
    if (writeStreams.has(ip)) {
      return writeStreams.get(ip);
    }
    writeStreams.set(ip, fs.createWriteStream(`./${ip}_requests.log`, { flag: 'a' }));
    writeStreams.get(ip).on('open', () => console.log(`Stream ${ip} has been opened.`));

    return writeStreams.get(ip);
  };
}
