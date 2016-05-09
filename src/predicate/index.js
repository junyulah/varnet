'use strict';

let normal = require('./normal');
let any = require('./any');
let exist = require('./exist');
let map = require('./map');

let predicates = [normal, any, exist, map];

let predicateMap = (() => {
    let map = {};
    for (let i = 0; i < predicates.length; i++) {
        let predicate = predicates[i];
        let type = predicate.type;
        map[type] = predicate;
    }
    return map;
})();

let completeReduce = (reduceDepValues) => {
    for (let i = 0; i < predicates.length; i++) {
        let predicate = predicates[i];
        predicate.reduce = predicate.reduce(reduceDepValues);
    }
};

module.exports = {
    predicateMap,
    completeReduce,
    predicates
};
