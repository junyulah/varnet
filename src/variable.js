'use strict';

let util = require('./util');

let isObject = util.isObject;
let isArray = util.isArray;

/**
 * variable data structure
 *
 * {
 *      deps: [], // the variable it depends on
 *      transition, // transition function
 *      domain
 * }
 *
 * eg: a = {
 *      deps: [{
 *          variable: b
 *      }],
 *      transition: (b) => b + 1
 * }
 *
 * b = {
 *    deps,
 *    transition
 * }
 *
 * when b's value is 5, we can solve variable a and get 6.
 *
 * atom variable: has none deps and transition
 *
 * dep = {
 *      variable,
 *      type
 * }
 *
 * The dependency between variables have types.
 *
 * eg: j = ∀i, i > 0. i, j are variables, and j depends on i. The dependency type is ∀.
 */

let unique = 'da765e68-fe01-4073-9c8c-f3e3cda0b4f9';

let defVar = function () {
    let args = Array.prototype.slice.call(arguments);
    if (args.length === 0) {
        return {
            __variable: unique
        }; // atom variable
    }
    let transition = args.pop();
    if (typeof transition !== 'function') {
        throw new TypeError('Expect function for last arguments of defVar. but got ' + transition);
    }
    let deps = [];
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        deps.push(argToDep(arg));
    }
    return {
        deps,
        transition,
        __variable: unique
    };
};

let argToDep = (arg) => {
    let dep = null;
    if (isDep(arg)) {
        dep = {
            variable: arg.variable,
            type: arg.type
        };
    } else {
        if (!isVariable(arg)) {
            throw new TypeError('Expect variable(object) but got ' + arg);
        }
        dep = {
            variable: arg,
            type: 'normal'
        };
    }
    return dep;
};

let domain = (variable, list) => {
    if (!isVariable(variable)) {
        throw new TypeError('');
    }
    if (isArray(list)) {
        variable.domain = list;
    } else if (isVariable(list)) {
        variable.domain = list;
    } else {
        throw new TypeError('Expect variable or array for domain');
    }
    return variable;
};

let dep = (variable, type) => {
    if (!isVariable(variable)) {
        throw new TypeError('Expect variable but got ' + variable);
    }
    return {
        variable,
        type,
        mark: unique
    };
};

let isDep = v => isObject(v) && v.mark === unique;

let isVariable = (v) => isObject(v) && v.__variable === unique;

let isAtomVariable = (v) => isVariable(v) && !v.deps && !v.transition;

module.exports = {
    defVar,
    isAtomVariable,
    isVariable,
    dep,
    domain
};
