'use strict';

let variable = require('./variable');
let solve = require('./solve');

/**
 * variable
 *      (1) define variable
 *      (2) instantiate some variables and to solve some other variables.
 */

module.exports = {
    defVar: variable.defVar,
    solve
};
