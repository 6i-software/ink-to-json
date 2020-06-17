#!/usr/bin/env node

/*
 * @copyright © 2020 6i
 * @author 20100 <vb20100bv@gmail.com>
 * Released under a MIT license.
 */

const ApplicationCLI = require('./src/ApplicationCLI');

// Let's go party !
let application = new ApplicationCLI();
application.start();