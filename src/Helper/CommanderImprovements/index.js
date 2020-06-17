/*
 * @copyright 6i (2020)
 * @author 20100 <vb20100bv@gmail.com>
 * Released under a MIT license.
 */

const {improvementsHelpInformation, improvementsOptionHelp, improvementsCommandHelp, improvementsPrepareCommands} = require('./formatHelper');
const {splashscreen} = require('./splashcreen');
const {overridesConsoleMethods} = require('./consoleMethods');

/**
 * Apply improvements on a command
 *
 * @param command
 */
function ApplyImprovementsOnCommand(command) {
    command.helpInformation = improvementsHelpInformation(command);
    command.optionHelp = improvementsOptionHelp(command);
    command.commandHelp = improvementsCommandHelp(command);
    command.prepareCommands = improvementsPrepareCommands(command);
}

/**
 * Improves Commander program
 *
 * @param {Command} program, see https://github.com/tj/commander.js/blob/master/index.js
 */
function applyCommanderImprovements(program) {
    // Apply on main command
    ApplyImprovementsOnCommand(program);

    // Apply on all commands attache to main program
    program.commands.map((cmd) => {
        ApplyImprovementsOnCommand(cmd);
    });

    // Add splashscreen to main program
    program.splashscreen = splashscreen;

    // Overrides console methods, depend on level verbositiy (-v, -vv, -vvv)
    overridesConsoleMethods();
}

module.exports = {
    applyCommanderImprovements
}