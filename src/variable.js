'use strict';

/**
 * variable data structure
 *
 * {
 *      deps: [], // the variable it depends on
 *      transition // transition function
 * }
 *
 * eg: a = {
 *      deps: [b],
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
 */

let defVar = function () {
    let args = Array.prototype.slice.call(arguments);
    if (args.length === 0) {
        return {}; // atom variable
    }
    let transition = args.pop();
    if (typeof transition !== 'function') {
        throw new TypeError('Expect function for last arguments of defVar. but got ' + transition);
    }
    for (let i = 0; i < args.length; i++) {
        if (!isVariable(args[i])) {
            throw new TypeError('Expect variable(object) but got ' + args[i]);
        }
    }
    return {
        deps: args,
        transition
    };
};

let isVariable = (v) => v && typeof v === 'object';

let isAtomVariable = (v) => isVariable(v) && !v.deps && !v.transition;

module.exports = {
    defVar,
    isAtomVariable
};
