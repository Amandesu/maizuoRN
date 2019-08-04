var inquirer = require('inquirer');

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
    /* spawn('npm', ['run','start'], {
        stdio: 'inherit'
    }); */
    exec('npm run start', {stdio: 'inherit'});
})
