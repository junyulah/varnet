'use strict';

let variable = require('./variable');
let solve = require('./solve');
let predicate = require('./predicate');
let util = require('./util');
let combinators = require('./combinator');

let dep = variable.dep;
let predicates = predicate.predicates;
let append = util.append;

let methods = {};
for (let i = 0; i < predicates.length; i++) {
    let type = predicates[i].type;
    methods[type] = (variable) => dep(variable, type);
}

/**
 * variable
 *      (1) define variable
 *      (2) instantiate some variables and to solve some other variables.
 */

module.exports = append({
    defVar: variable.defVar,
    solve,
    domain: variable.domain
}, append(methods, combinators));
