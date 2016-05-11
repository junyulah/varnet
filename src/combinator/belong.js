'use strict';

let variable = require('../variable');
let defVar = variable.defVar;
let domain = variable.domain;

module.exports = function () {
    let args = Array.prototype.slice.call(arguments);
    if(!args.length) {
        return defVar();
    } else if (args.length === 1) {
        return domain(defVar(), args[0]);
    } else {
        return domain(defVar(), defVar.apply(undefined, args));
    }
};
