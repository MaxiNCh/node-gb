const fs = require('fs');
const path = require('path');
const http = require('http');

http
  .createServer((request, response) => {
    if (request.headers.accept.includes('text/html')) {
      const requestPath = request.url.slice(1);

      const filePath = requestPath ? path.resolve(__dirname, requestPath) : __dirname;

      if (isFile(filePath)) {
        returnFileContent(response, filePath);
      } else {
        returnList(response, filePath);
      }
    }
  })
  .listen(8080, 'localhost');

console.log('Server is running...');

function isFile(fileName) {
  return fs.lstatSync(fileName).isFile();
}

function returnFileContent(response, filePath) {
  const readStream = fs.createReadStream(filePath, 'utf8');

  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

  readStream.pipe(response);
}

function returnList(response, filePath) {
  var list = fs.readdirSync(filePath);
  list.unshift('..');

  response.writeHead(200, { 'Content-Type': 'text/html' });

  response.write('<ul>');
  list.forEach((fileName) => {
    let linkPath;
    if (fileName === '..') {
      const parentPath = path.normalize(path.resolve(filePath, '..'));
      linkPath = path.relative(__dirname, parentPath);
    } else {
      const relPath = path.relative(__dirname, filePath);
      linkPath = path.join(relPath, fileName);
    }

    response.write('<li>');
    response.write(`<a href="/${linkPath}">${fileName}</a>`);
  });
  response.write('</ul>');

  response.end();
}
