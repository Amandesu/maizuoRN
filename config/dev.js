var inquirer = require('inquirer');
var fs = require("fs");
var path = require("path");

const spawn = require('child_process').spawn;
var exec = require('child_process').execSync;

inquirer.prompt({
    type: 'rawlist',
    message: '请选择模块?',
    default: true,
    name:"module",
    choices:["city", "a"]
}).then((answer) =>{
    process.env.module =answer.module;
    var fs = require('fs')
    fs.truncate(path.join(process.cwd(), "src/modules/index.js"), 0, () => {
        fs.writeFileSync(path.join(process.cwd(), "src/modules/index.js"), `
export { default as default } from "./${answer.module}";
        `) 
        const dev = spawn('react-native', ['start', '--reset-cache'], {
            env: process.env
        })
        dev.stdout.pipe(process.stdout)
    });
})
