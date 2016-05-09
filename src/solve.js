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
    if (map.has(keys(variable, type))) { // look up dit first
        return map.get(keys(variable, type));
    } else {
        if (!predicateMap[type]) {
            throw new TypeError('unrecognized predicate type. type ' + type);
        }
        if (predicateMap[type].use === 'domain') {
            return solveDomain(variable, map);
        } else {
            return solveTransition(variable, map, type);
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
    map.set(keys(variable, 'domain'), domain);
    return domain;
};

let solveTransition = (variable, map, type) => {
    // look up context dit
    if (map.has(['context', variable])) {
        return map.get(['context', variable]);
    }
    if (isAtomVariable(variable)) {
        throw new Error('can not solve variable, exist none determined variable.');
    }
    // collect deps values
    let deps = variable.deps;
    let depsValues = [];
    for (let i = 0; i < deps.length; i++) {
        let dep = deps[i];
        let depRet = solveVariable(dep.variable, map, dep.type);
        depsValues.push({
            depRet,
            type: dep.type,
            variable: dep.variable
        });
    }
    let ret = reduceDep(depsValues, variable.transition, map);

    map.set(keys(variable, type), ret);
    return ret;
};

let keys = (variable, type) => {
    if (type === 'domain' || predicateMap[type].use === 'domain') {
        return ['domain', variable];
    } else {
        return [variable];
    }
};

let reduceDep = (depsValues, transition, map) => {
    if (depsValues.length === 0) {
        return transition();
    } else {
        let curDep = depsValues[0];
        let nextDepsValues = depsValues.slice(1);
        let next = (item) => {
            map.set(['context', curDep.variable], item);
            let nextTansition = fillFirst(transition, item);
            let nextValue = reduceDep(nextDepsValues, nextTansition, map);
            map.remove(['context', curDep]);
            return nextValue;
        };

        return predicateMap[curDep.type].reduce(curDep, next, map);
    }
};

module.exports = solve;
