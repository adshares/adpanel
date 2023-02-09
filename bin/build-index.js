/*
 * Copyright (C) 2020-2022 Adshares sp. z o.o.
 *
 * This file is part of AdPanel
 *
 * AdPanel is free software: you can redistribute and/or modify it
 * under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdPanel is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdPanel. If not, see <https://www.gnu.org/licenses/>
 */

// Usage: node build-index.js existing-template output-index-html [output-robots-txt]
const fs = require('fs');

const templateFile = process.argv[2];
if (!templateFile) {
  console.log('No template file name provided');
  process.exit(1);
}

const indexFile = process.argv[3];
if (!indexFile) {
  console.log('No preview file name provided');
  process.exit(1);
}

let message = fs.readFileSync('/dev/stdin').toString().trim();
if (!message) {
  console.log('No JSON provided');
  message = '[]';
}

const json = JSON.parse(message);

const indexFields = [
  'index-title',
  'index-description',
  'index-keywords',
  'index-meta-tags',
];
const robotsField = 'robots-txt';

function getContentFromJson(field) {
  return json.hasOwnProperty(field) ? json[field].content : '';
}

fs.readFile(templateFile, 'utf8', function (error, data) {
  if (error) {
    console.log(`Error while reading template ${templateFile}`, error);
    process.exit(1);
  }

  indexFields.forEach((field) => {
    const searchValue = '${' + field.replace(/-/g, '_').toUpperCase() + '}';
    data = data.replace(searchValue, getContentFromJson(field));
  });

  fs.writeFile(indexFile, data, function (error) {
    if (error) {
      console.log(`Error while writing ${indexFile}`, error);
      process.exit(1);
    }

    console.log(`The index file ${indexFile} has been saved`);
  });
});

const robotsFile = process.argv[4];
if (robotsFile) {
  fs.writeFile(robotsFile, getContentFromJson(robotsField), (error) => {
    if (error) {
      console.log(`Error while writing ${robotsFile}`, error);
      process.exit(1);
    }
    console.log(`The robots file ${robotsFile} has been saved`);
  });
}
