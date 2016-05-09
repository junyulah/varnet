'use strict';

let util = require('./util');
let variable = require('./variable');
let predicate = require('./predicate');
let predicateMap = predicate.predicateMap;

let pairsToKeysMap = util.pairsToKeysMap;
let fillFirst = util.fillFirst;

let isAtomVariable = variable.isAtomVariable;
let isVariable = variable.isVariable;

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
        rets.push(solveVariable(unknown[i], map, 'normal'));
    }
    return rets;
};

let solveVariable = (variable, map, type) => {
    if (map.has(keys(variable, type))) { // look up dit first (initial value)
        return map.get(keys(variable, type));
    } else if (map.has(keys(variable, type, 'context'))) { // context cache (context value)
        return map.get(keys(variable, type, 'context'));
    } else {
        if (!predicateMap[type]) {
            throw new TypeError('unrecognized predicate type. type ' + type);
        }
        if (predicateMap[type].use === 'domain') {
            return solveDomain(variable, map);
        } else {
            return solveTransition(variable, map);
        }
    }
};

let solveDomain = (variable, map) => {
    let domain = variable.domain;
    if (!domain) {
        throw new Error('can not solve variable, lack of domain for variable ' + variable);
    }
    if (isVariable(domain)) {
        domain = solveVariable(domain, map, 'normal');
    }
    return domain;
};

let solveTransition = (variable, map) => {
    if (isAtomVariable(variable)) {
        throw new Error('can not solve variable, exist none determined variable.');
    }
    // collect deps values
    let deps = variable.deps;
    let ret = reduceDeps(deps, variable.transition, map);

    return ret;
};

let keys = (variable, type, cacheType) => {
    if (type === 'domain' || predicateMap[type].use === 'domain') {
        return cacheType ? [cacheType, 'domain', variable] : ['domain', variable];
    } else {
        return cacheType ? [cacheType, variable] : [variable];
    }
};

// TODO [opt] use stack instead of map to store context value

let reduceDeps = (deps, transition, map) => {
    if (deps.length === 0) {
        return transition();
    } else {
        let dep = deps[0];
        let depRet = solveVariable(dep.variable, map, dep.type);
        let nextDeps = deps.slice(1);
        let next = (item) => {
            map.set(['context', dep.variable], item);
            let nextTansition = fillFirst(transition, item);
            let nextValue = reduceDeps(nextDeps, nextTansition, map);
            map.remove(['context', dep.variable]);
            return nextValue;
        };

        return predicateMap[dep.type].reduce(depRet, next, map);
    }
};

module.exports = solve;
