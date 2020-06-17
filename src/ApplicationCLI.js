/*
 * @copyright 6i (2020)
 * @author 20100 <vb20100bv@gmail.com>
 * Released under a MIT license.
 */

'use strict';

const {Command} = require('commander');
const {applyCommanderImprovements} = require('./Helper/CommanderImprovements');

/**
 * Constructor of CLI application
 *
 * @returns {ApplicationCLI}
 * @constructor
 */
function ApplicationCLI() {
    if (!(this instanceof ApplicationCLI)) {
        return new ApplicationCLI();
    }

    // Init package metadatas
    this.pkg = require('../package.json');
    this.name = Object.keys(this.pkg.bin)[0];
    this.version = this.pkg.version;
    this.description = this.pkg.description;
    this.homepage = this.pkg.homepage;

    // Init arguments and options
    this.program = new Command();
}

/**
 * Start application CLI Commander
 */
ApplicationCLI.prototype.start = function () {
    // Configure application CLI
    this.configure();

    // Add -h if no arguments given
    if(process.argv.length === 2) {
        process.argv.push('--help');
    }

    // Run the program by parsing command line arguments (process.argv)
    this.program.parse();
}

/**
 * Configure application CLI Commander
 */
ApplicationCLI.prototype.configure = function() {
    let program = this.program;

    program
        .name(this.name)
        .description(this.description)
        .version(this.version, '-V, --version', 'Display this application version.')
        .helpOption('-h, --help', 'Display this help message.')
        .addHelpCommand('help [command]', 'Display help for command.')
        .option('-s, --silent', 'Do not output any message.')
        .option('-v, --verbose', 'Increase the verbosity level : 1 normal, 2 more verbose and 3 for debug.', (value, previous) => {
            return previous + 1;
        }, 0);

    program._homepage = (typeof this.pkg.homepage !== "undefined") ? this.pkg.homepage : '';

    // Add commands
    require('./Command/compileCommand').add(program);

    // Add improvements to Commander application (change helper, add colors, verbosity logger...)
    applyCommanderImprovements(program);
}

module.exports = ApplicationCLI;