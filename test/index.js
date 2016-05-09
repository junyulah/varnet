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

    it('multi', () => {
        let x = defVar();
        let y = defVar(x, (x) => x * x);
        let z = defVar(x, y, (x, y) => y + x);

        let w = defVar();
        let k = defVar(w, z, (w, z) => w - z);

        let rets = solve([
            [x, 5],
            [w, 10]
        ], [z, k]);
        assert.deepEqual(rets, [30, -20]);
    });

    it('insert at mid', () => {
        let x = defVar();
        let y = defVar(x, (x) => x * x);
        let z = defVar(x, y, (x, y) => y + x);

        let rets = solve([
            [x, 5],
            [y, 10]
        ], [z]);
        assert.deepEqual(rets, [15]);
    });

    it('repeat solve', () => {
        let x = defVar();
        let y = defVar(x, (x) => x * x);
        let z = defVar(x, y, (x, y) => y + x);

        let rets = solve([
            [x, 5],
            [y, 10]
        ], [z]);
        assert.deepEqual(rets, [15]);

        let rets2 = solve([
            [x, 5]
        ], [z]);
        assert.deepEqual(rets2, [30]);
    });
});
