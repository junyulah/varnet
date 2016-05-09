'use strict';

let util = require('./util');
let isAtomVariable = require('./variable').isAtomVariable;

let pairsToKeysMap = util.pairsToKeysMap;

/**
 * @param {Array} known the variables and values known
 * [[a, 3], [b, 4]]
 *
 * @param {Array} unknown the variables do not know their values
 * [c, d]
 */
let solve = (known, unknown) => {
    let map = pairsToKeysMap(known);
    let rets = [];
    for (let i = 0; i < unknown.length; i++) {
        rets.push(solveVariable(unknown[i], map));
    }
    return rets;
};

let solveVariable = (variable, map) => {
    if (map.has([variable])) { // look up dit first
        return map.get([variable]);
    }
    if (isAtomVariable(variable)) {
        throw new Error('can not solve variable, exist none determined variable.');
    }
    // collect deps values
    let deps = variable.deps;
    let depsValues = [];
    for (let i = 0; i < deps.length; i++) {
        depsValues.push(solveVariable(deps[i], map));
    }

    let transition = variable.transition;
    let ret = transition.apply(undefined, depsValues);
    map.set([variable], ret);
    return ret;
};

module.exports = solve;
