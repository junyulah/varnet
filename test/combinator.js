'use strict';

let index = require('../index');
let assert = require('assert');

let belong = index.belong;
let solve = index.solve;
let map = index.map;
let defVar = index.defVar;

describe('combinator', () => {
    it('belong', () => {
        let y = belong([1, 2, 3]);
        let z = defVar(map(y), (y) => y + 1);
        let ret = solve([], [z]);
        assert.deepEqual(ret, [[2, 3, 4]]);
    });

    it('belong2', () => {
        let x = belong();
        let y = belong(x, (x) => [2, x]);
        let z = defVar(map(y), (y) => y + 1);
        let ret = solve([[x, 3]], [z]);
        assert.deepEqual(ret, [[3, 4]]);
    });
});
