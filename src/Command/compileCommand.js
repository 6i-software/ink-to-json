/*
 * @copyright 6i (2020)
 * @author 20100 <vb20100bv@gmail.com>
 * Released under a MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const os = require('os');
const shell = require('shelljs');
const md5 = require('md5');
const EOL = require('os').EOL;

/**
 * Add compile command into CLI application
 *
 * @param program see Caporal.js
 */
function add(program) {

    function _run(inkfile, command, program) {
        const options = _getOptions(command, program);
        if (!options.watch) {
            console.log(EOL + '=== Start compilation ===')
        } else {
            console.log(EOL + '=== Start watching ink file ===')
        }

        let datas = {}
        datas.inklecateBin = _getInklecateBin();
        datas.inkfile = _checkInkfile(inkfile);
        datas.outputJson = _getOutputJson(options, datas.inkfile);

        console.info('Ink name file: ' + chalk.yellow(datas.inkfile.fileName));
        console.info('Ink path file: ' + chalk.yellow(datas.inkfile.pathfile));
        console.info('Output JSON: ' + chalk.yellow(datas.outputJson));
        console.info('Inklecate bin: ' + chalk.yellow(datas.inklecateBin));

        if (!options.watch) {
            _executeCompilation(datas, () => {
                program._exit(0, 'commander.compilCommand.inklecate', 'Inklecate success compilation !');
            });
        } else {
            _watchInkfile(datas);
        }
    }

    /**
     * Compilation of a story ink file into json with inkelate bin
     */
    function _executeCompilation(datas, cbExit = null) {
        let inklecateCmd = datas.inklecateBin + ' -o ' + datas.outputJson + ' ' + datas.inkfile.pathfile;
        let msg;
        console.info('Ink compilation is starting.');
        shell.exec(inklecateCmd, {silent: true}, function (code, stdout, stderr) {
            if (code !== 0) {
                msg = '[error] Failed inklecate execution.'
                    + ((stdout) ? EOL + stdout : '')
                    + ((stderr) ? EOL + stderr : '');
                console.error(msg);
                program._exit(1, 'commander.compilCommand.inklecate', msg);
            } else {
                msg = 'Inklecate compilation has finished !';
                console.success(msg);
                if(cbExit !== null) {
                    cbExit();
                }
            }
        });
    }

    /**
     * Watch changements in ink story file for launch compilation each times
     */
    function _watchInkfile(datas) {
        let pathinkfile = datas.inkfile.pathfile;
        let fsWait = false;
        let md5Previous = null;
        fs.watch(pathinkfile, (event, filename) => {
            if (filename) {
                if (fsWait) return;
                fsWait = setTimeout(() => {
                    fsWait = false;
                }, 100);

                const md5Current = md5(fs.readFileSync(pathinkfile));
                if (md5Current === md5Previous) {
                    return;
                }
                md5Previous = md5Current;
                console.log(EOL + `=== Detecting changement in Ink file "${filename}" ===`);
                _executeCompilation(datas);
            }
        });
    }

    /**
     * Get output JSON to use with compilation
     */
    function _getOutputJson(options, inkfile) {
        let outputJson;
        if (typeof options.output === 'undefined') {
            outputJson = path.join(path.dirname(inkfile.pathfile), inkfile.storyName + '.json');
            console.debug('No output options given, use default: ' + chalk.yellow(outputJson));
        } else {
            outputJson = path.resolve(options.output);
        }
        return outputJson;
    }

    /**
     * Get all options (global & local)
     */
    function _getOptions(command, program) {
        const globalOptions = program.opts();
        const commandOptions = command.opts();
        return {...globalOptions, ...commandOptions};
    }

    /**
     * Get path to inklecate depends on os platform
     */
    function _getInklecateBin() {
        const platform = os.platform();
        let inklecateBin = null;
        let inklecateFolder = path.join(__dirname, '..', '..', 'bin', 'inklecate');
        if (platform === 'win32') {
            inklecateBin = 'inklecate_win.exe';
        } else if (platform === 'linux') {
            inklecateBin = 'inklecate_linux';
        } else if (platform === 'darwin') {
            inklecateBin = 'inklecate_mac';
        } else {
            throw new Error('Unable to find os.platform !');
        }

        return path.resolve(path.join(inklecateFolder, inklecateBin));
    }

    /**
     * Resolve inkfile and check if exists
     */
    function _checkInkfile(inkfile) {
        let pathfile = path.resolve(inkfile);
        if (fs.existsSync(pathfile)) {
            if (path.extname(pathfile) !== '.ink') {
                let msg = 'The given Inkfile must have *.ink extension: ' + chalk.yellow(pathfile);
                console.error(msg);
                program._exit(1, 'commander.compilCommand.inkfile', msg);
            }

            console.debug('The given Inkfile exists and available: ' + chalk.yellow(pathfile));
            return {
                pathfile: pathfile,
                fileName: path.basename(pathfile),
                storyName: path.basename(pathfile).split('.').slice(0, -1).join('.')
            }
        } else {
            let msg = 'Unable to find the given Inkfile: ' + chalk.yellow(pathfile);
            console.error(msg);
            program._exit(1, 'commander.compilCommand.inkfile', msg);
        }
    }

    // Add compile command into program
    program
        .command('compile <inkFile>')
        .option('-o, --output <jsonFile>', 'Set output JSON file.')
        .option('-w, --watch', 'Enable watch mode, to detect if ink file has changed.')
        .description('Compile story Ink file into JSON.')
        .action((inkfile, command) => _run(inkfile, command, program));
}

module.exports = {
    add
};