//requiring path and fs modules
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const componentsPath='source/components'
//joining path of directory 
const directoryComponentsPath = path.join(__dirname, componentsPath);
//passsing directoryPath and callback function
fs.readdir(directoryComponentsPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        exec(`token-transformer ${componentsPath}/${file} tokens/components/${file} --preserveRawValue=true --resolveReferences=false`)
        console.log(file); 
    });
});

const themesPath='source/themes'
//joining path of directory 
const directoryThemesPath = path.join(__dirname, themesPath);
//passsing directoryPath and callback function
fs.readdir(directoryThemesPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        exec(`token-transformer ${themesPath}/${file} tokens/themes/${file} `)
        console.log(file); 
    });
});