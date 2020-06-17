/*
 * @copyright 6i (2020)
 * @author 20100 <vb20100bv@gmail.com>
 * Released under a MIT license.
 */

'use strict';

const chalk = require('chalk');
const os = require('os');
const EOL = os.EOL;
const util = require('util');

/**
 * Parse verbosity level
 * TODO: Count '-v' occurences to determine level verbosity
 *
 * @returns {number}
 */
function getLevelVerbosity() {
    let args = process.argv;
    let level = 0;
    if(args.includes('--verbose') || args.includes('-v')) {
        level = 1;
    } else if(args.includes('-vv')) {
        level = 2;
    } else if(args.includes('-vvv')) {
        level = 3;
    }

    if(isSilent()) {
        level = 0;
    }
    return level;
}

function isSilent() {
    let args = process.argv;
    return (args.includes('--silent') || args.includes('-s'));
}

function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

/**
 * Change console method's behaviour
 */
function overridesConsoleMethods() {
    let _consoleError = console.error;
    let _consoleWarning = console.warning;
    let _consoleDebug = console.debug;
    let _consoleInfo = console.info;
    let _consoleLog = console.log;

    const verbose = getLevelVerbosity();

    console.error = function (message) {
        let prefix = '[error] ';
        arguments[0] = arguments[0].replace(/\[error\] /,'');
        arguments[0] = EOL + chalk.bgRed(prefix + arguments[0]);
        _consoleError.apply(console, arguments);
    }

    console.warning = function (message) {
        arguments[0] = chalk.yellow('[warning]') + ' ' + arguments[0];
        _consoleWarning.apply(console, arguments);
    };

    console.silly = function (message) {
        if (verbose > 2 && !isSilent()) {
            arguments[0] = chalk.magenta('[silly]') + ' ' + arguments[0];
            _consoleDebug.apply(console, arguments);
        }
    };

    console.debug = function (message) {
        if (verbose > 1 && !isSilent()) {
            const prefix = chalk.yellow('[debug]') + ' ';
            if(isObject(arguments[0])) {
                arguments[0] = prefix + util.inspect(arguments[0], false, null, true);
            } else {
                arguments[0] = prefix + arguments[0];
            }

            _consoleDebug.apply(console, arguments);
        }
    };

    console.info = function (message) {
        if (verbose > 0 && !isSilent()) {
            arguments[0] = chalk.blue('[info]') + ' ' + arguments[0];
            _consoleInfo.apply(console, arguments);
        }
    };

    console.log = function(message) {
        if (!isSilent()) {
            _consoleLog.apply(console, arguments);
        }
    };

    console.success = function(message) {
        if (!isSilent()) {
            arguments[0] = chalk.greenBright('[success] ' + arguments[0]);
            _consoleLog.apply(console, arguments);
        }
    }
}

module.exports = {
    overridesConsoleMethods
};