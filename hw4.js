const fs = require('fs');
const path = require('path');

const yargs = require('yargs');
const inquirer = require('inquirer');

const options = yargs
  .usage('Usage: [-d <directory>]')
  .option('directory', {alias: 'd', describe: 'Path to directory', type: 'string'})
  .argv;

const givenDirectory = options.directory;
const directory = givenDirectory ? path.resolve(process.cwd(), givenDirectory) : process.cwd();
requestPath(directory);

function requestPath(directory) {
  var list = fs.readdirSync(directory);
  list.unshift('..');

  return inquirer
    .prompt([
      {
        name: "fileName",
        type: 'list',
        message: "Choose file:",
        choices: list
      }
    ])
    .then((answer) => handleFolderOrFile(directory, answer.fileName));
};

function handleFolderOrFile(directory, fileName) {
  const filePath = path.normalize(path.resolve(directory, fileName));

  if (isFile(filePath)) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      console.log('\n' + '********** CONTENT OF FILE: ***********' + '\n');
      console.log(data);
    })
  } else {
    requestPath(filePath);
  }
};

function isFile(fileName) {
  return fs.lstatSync(fileName).isFile();
};
