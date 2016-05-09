'use strict';

let keysmap = require('keysmap');

let pairsToKeysMap = (pairs, map) => {
    map = map || keysmap();
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].slice(0);
        let value = pair.pop();
        map.set(pair, value);
    }
    return map;
};

let fillFirst = (func, arg) => function () {
    let args = Array.prototype.slice.call(arguments);
    args.unshift(arg);
    return func.apply(undefined, args);
};

let isObject = v => v && typeof v === 'object';

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

let append = (m1, m2) => {
    for (var name in m2) {
        m1[name] = m2[name];
    }
    return m1;
};

module.exports = {
    pairsToKeysMap,
    fillFirst,
    isObject,
    isArray,
    append
};
