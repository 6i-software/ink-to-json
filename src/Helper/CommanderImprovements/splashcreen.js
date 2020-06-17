/*
 * @copyright 6i (2020)
 * @author 20100 <vb20100bv@gmail.com>
 * Released under a MIT license.
 */

const chalk = require('chalk');

function splashscreen(program) {
    let splashscreen = `
   ██████╗  ██╗   
  ██╔════╝    ║   ` + program._name + ` - v` + program._version + `
  ███████   ██║   
  ██    ██╗ ██║   Copyright © 2020
  ╚██████╔╝ ██║   ` + program._homepage + `
   ╚═════╝  ╚═╝  
`
    splashscreen = splashscreen.replace(/█+/gi, (match) => {
        return chalk.blue(match);
    }).replace(/═|╝|╚|║|╔|╗/gi, (match) => {
        return chalk.gray(match);
    });

    return splashscreen;
}

module.exports = {
    splashscreen
}