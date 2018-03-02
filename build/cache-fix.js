/**
 * Yayınlanan dosyanın browser cache problemine yaşanmadan yüklenebilmesi için
 * JS ve CSS dosylarına versiyon filtresi ekleniyor. Böylece sadece versiyon değişikliklerinde
 * dosyalar yeniden yüklenecektir.
 */

const path = require('path');
var fs = require("fs");
const colors = require('colors/safe');
const appVersion = require('../package.json').version;
const httpFileName = '../dist/index.html';

const httpFilePath = path.join(__dirname + '/../dist/index.html');

console.log(colors.cyan('\nRunning fix browser cache problem'));

fs.readFile(httpFilePath, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var result = data;
    result = result.replace(/bundle.js/g, 'bundle.js?ver=' + appVersion);
    result = result.replace(/favicon.png/g, 'favicon.png?ver=' + appVersion);
    result = result.replace(/theme-indigo.css/g, 'theme-indigo.css?ver=' + appVersion);
    result = result.replace(/layout-indigo.css/g, 'layout-indigo.css?ver=' + appVersion);
    result = result.replace(/bundle.css/g, 'bundle.css?ver=' + appVersion);

    fs.writeFile(httpFilePath, result, 'utf8', function (err) {
        if (err) {
            return console.log(colors.red(err));
        }

        console.log(colors.green(`Updating bundle version ${colors.yellow(appVersion)}`));
    });
});