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

module.exports = {
    pairsToKeysMap
};
