/*
 * @copyright 6i (2020)
 * @author 20100 <vb20100bv@gmail.com>
 * Released under a MIT license.
 */

const chalk = require('chalk');
const {splashscreen} = require('./splashcreen');

/**
 * Return function use to show program help documentation
 *
 * @param {Command} program, see https://github.com/tj/commander.js/blob/master/index.js
 */
function improvementsHelpInformation(program) {

    return function () {
        let desc = [];
        if (program._description) {
            desc = [
                program._description,
                ''
            ];

            const argsDescription = program._argsDescription;
            if (argsDescription && program._args.length) {
                const width = program.padWidth();
                const columns = process.stdout.columns || 80;
                const descriptionWidth = columns - width - 5;
                desc.push('Arguments:');
                desc.push('');
                program._args.forEach((arg) => {
                    desc.push('  ' + pad(arg.name, width) + '  ' + wrap(argsDescription[arg.name], descriptionWidth, width + 4));
                });
                desc.push('');
            }
        }

        const hrWidth = program.padWidth() + 4 + _largestMessageWidth(program);

        let cmdName = program._name;
        if (program._aliases[0]) {
            cmdName = cmdName + '|' + program._aliases[0];
        }
        let parentCmdNames = '';
        for (let parentCmd = program.parent; parentCmd; parentCmd = parentCmd.parent) {
            parentCmdNames = parentCmd.name() + ' ' + parentCmdNames;
        }
        const usage = [
            _title('Usage:') + '\n  ' + parentCmdNames + cmdName + ' ' + program.usage(),
            ''
        ];

        let cmds = [];
        const commandHelp = program.commandHelp();
        if (commandHelp) cmds = [commandHelp];

        const options = [
            _title('Options:'),
            '' + program.optionHelp().replace(/^/gm, '  '),
            ''
        ];

        let result = usage
            .concat(options)
            .concat(cmds)
            .join('\n');

        if (program.parent === null) {
            result = _hr(hrWidth, '_')
                + '\n'
                + splashscreen(program)
                + _hr(hrWidth)
                + '\n\n'
                + _colorize(result)
        } else {
            result = '\n' + _colorize(result)
        }

        return result + '\n';
    }
}

function _hr(width, char = '─') {
    let hr = '';
    for (let i = 0; i < width; i++) {
        hr += char;
    }
    return hr;
}

function _largestMessageWidth(program) {
    const commands = program.prepareCommands();
    const options = [].slice.call(program.options);

    let messages = []
    commands.map((command) => {
        if (typeof command[1] !== 'undefined') {
            messages.push(command[1]);
        }
    });
    options.map((option) => {
        if (typeof option.description !== 'undefined') {
            messages.push(option.description);
        }
    });

    return messages.reduce((max, message) => {
        return Math.max(max, message.length);
    }, 0);
}

/**
 * Return function use to show help for options.
 *
 * @param {Command} program
 */
function improvementsOptionHelp(program) {
    return function () {
        const width = program.padWidth();
        const columns = process.stdout.columns || 80;
        const descriptionWidth = columns - width - 4;

        function padOptionDetails(flags, description) {
            return pad(flags, width) + '  ' + optionalWrap(description, descriptionWidth, width + 2);
        };

        // Explicit options (including version)
        const help = program.options.map((option) => {
            const fullDesc = option.description +
                ((!option.negate && option.defaultValue !== undefined) ? ' (default: ' + JSON.stringify(option.defaultValue) + ')' : '');
            return padOptionDetails(option.flags, fullDesc);
        });

        // Implicit help
        const showShortHelpFlag = program._helpShortFlag && !program._findOption(program._helpShortFlag);
        const showLongHelpFlag = !program._findOption(program._helpLongFlag);
        if (showShortHelpFlag || showLongHelpFlag) {
            let helpFlags = program._helpFlags;
            if (!showShortHelpFlag) {
                helpFlags = program._helpLongFlag;
            } else if (!showLongHelpFlag) {
                helpFlags = program._helpShortFlag;
            }
            help.push(padOptionDetails(helpFlags, program._helpDescription));
        }

        return help.join('\n');
    }
}

/**
 * Return function use to show command help documentation
 *
 * @param {Command} program
 */
function improvementsCommandHelp(program) {
    return function () {
        if (!program.commands.length && !program._lazyHasImplicitHelpCommand()) return '';

        const commands = program.prepareCommands();
        const width = program.padWidth();
        const columns = process.stdout.columns || 80;
        const descriptionWidth = columns - width - 4;

        return [
            _title('Available commands'),
            commands.map((cmd) => {
                const desc = cmd[1] ? '  ' + cmd[1] : '';
                return (desc ? pad(cmd[0], width) : cmd[0]) + optionalWrap(desc, descriptionWidth, width + 2);
            }).join('\n').replace(/^/gm, '  '),
            ''
        ].join('\n');
    };
}

/**
 * Prepare commands
 */
function improvementsPrepareCommands(program) {
    return function () {
        const commandDetails = program.commands.filter((cmd) => {
            return !cmd._hidden;
        }).map((cmd) => {
            const args = cmd._args.map((arg) => {
                return humanReadableArgName(arg);
            }).join(' ');

            return [
                cmd._name + (cmd._aliases[0] ? '|' + cmd._aliases[0] : ''),
                cmd._description
            ];
        });

        if (program._lazyHasImplicitHelpCommand()) {
            commandDetails.push([program._helpCommandnameAndArgs, program._helpCommandDescription]);
        }
        return commandDetails;
    }
}

/**
 * Takes an argument and returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {string}
 */
function humanReadableArgName(arg) {
    const nameOutput = arg.name + (arg.variadic === true ? '...' : '');
    return arg.required
        ? '<' + nameOutput + '>'
        : '[' + nameOutput + ']';
}

/**
 * Optionally wrap the given str to a max width of width characters per line
 * while indenting with indent spaces. Do not wrap if insufficient width or
 * string is manually formatted.
 *
 * @param {string} str
 * @param {number} width
 * @param {number} indent
 * @return {string}
 */
function optionalWrap(str, width, indent) {
    // Detect manually wrapped and indented strings by searching for line breaks
    // followed by multiple spaces/tabs.
    if (str.match(/[\n]\s+/)) return str;
    // Do not wrap to narrow columns (or can end up with a word per line).
    const minWidth = 40;
    if (width < minWidth) return str;

    return wrap(str, width, indent);
}

/**
 * Wraps the given string with line breaks at the specified width while breaking
 * words and indenting every but the first line on the left.
 *
 * @param {string} str
 * @param {number} width
 * @param {number} indent
 * @return {string}
 * @api private
 */
function wrap(str, width, indent) {
    const regex = new RegExp('.{1,' + (width - 1) + '}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)', 'g');
    const lines = str.match(regex) || [];
    return lines.map((line, i) => {
        if (line.slice(-1) === '\n') {
            line = line.slice(0, line.length - 1);
        }
        return ((i > 0 && indent) ? Array(indent + 1).join(' ') : '') + line.trimRight();
    }).join('\n');
}

/**
 * Pad `str` to `width`.
 *
 * @param {string} str
 * @param {number} width
 * @return {string}
 */
function pad(str, width) {
    const len = Math.max(0, width - str.length);
    return chalk.blueBright(str) + Array(len + 1).join(' ');
}

/**
 * Make title
 *
 * @param msg
 * @returns {string}
 */
function _title(text) {
    return chalk.bold(text);
}

/**
 * Add automatically colors by parsing regexp pattern.
 *
 * @param text {string}
 * @returns {string}
 */
function _colorize(text) {
    return text.replace(/<([a-z0-9-_.]+)>/gi, (match) => {
        return chalk.magenta(match);
    }).replace(/<command>/gi, (match) => {
        return chalk.magenta(match);
    }).replace(/\[([a-z0-9-_.]+)\]/gi, (match) => {
        return chalk.magenta(match);
    }).replace(/ --?([a-z0-9-_.]+)/gi, (match) => {
        return chalk.blueBright(match);
    });
};

module.exports = {
    improvementsHelpInformation,
    improvementsOptionHelp,
    improvementsCommandHelp,
    improvementsPrepareCommands
};