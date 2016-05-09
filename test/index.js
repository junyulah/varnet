'use strict';

let index = require('../index.js');
let assert = require('assert');

let defVar = index.defVar;
let solve = index.solve;

describe('varnet', () => {
    it('simple', () => {
        let x = defVar();
        let y = defVar(x, (x) => x * x);

        let rets = solve([
            [x, 5]
        ], [y]);
        assert.deepEqual(rets, [25]);
    });

    it('undirect', () => {
        let x = defVar();
        let y = defVar(x, (x) => x * x);
        let z = defVar(y, (y) => y - 10);

        let rets = solve([
            [x, 5]
        ], [z]);
        assert.deepEqual(rets, [15]);
    });
});
