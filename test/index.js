'use strict';

let index = require('../index.js');
let assert = require('assert');

let defVar = index.defVar;
let solve = index.solve;
let any = index.any;
let exist = index.exist;
let map = index.map;
let domain = index.domain;

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

    it('any', () => {
        let x = defVar();
        let y = defVar(any(x), (x) => x > 10);

        let rets = solve([
            ['domain', x, [2, 4, 6]]
        ], [y]);
        assert.deepEqual(rets, [false]);

        let rets2 = solve([
            ['domain', x, [12, 14, 16]]
        ], [y]);
        assert.deepEqual(rets2, [true]);
    });

    it('any variable', () => {
        let x = defVar();
        let y = defVar(x, x => {
            let ret = [];
            for (let i = 0; i < x; i++) {
                ret.push(i);
            }
            return ret;
        });
        let z = domain(defVar(), y);

        let w = defVar(any(z), (z) => z > 0);
        let r = defVar(any(z), (z) => z < 10);

        let rets = solve([
            [x, 10]
        ], [w, r]);
        assert.deepEqual(rets, [false, true]);
    });

    it('exist variable', () => {
        let x = defVar();
        let y = defVar(x, x => {
            let ret = [];
            for (let i = 0; i < x; i++) {
                ret.push(i);
            }
            return ret;
        });
        let z = domain(defVar(), y);

        let w = defVar(exist(z), (z) => z > 8);
        let r = defVar(exist(z), (z) => z > 18);

        let rets = solve([
            [x, 10]
        ], [w, r]);
        assert.deepEqual(rets, [true, false]);
    });

    it('map', () => {
        let i = defVar();

        let y = defVar(map(i), (i) => i + 1);

        let rets = solve([
            ['domain', i, [2, 5, 7]]
        ], [y]);
        assert.deepEqual(rets, [
            [3, 6, 8]
        ]);
    });

    it('map two', () => {
        let x = defVar();

        let J = defVar(x, x => {
            let ret = [];
            for (let i = 0; i < x; i++) {
                ret.push(i);
            }
            return ret;
        });

        let j = domain(defVar(), J);

        let y = defVar(map(j), (j) => j + 1);

        let w = defVar(map(x), y, (x, y) => {
            return [x, y];
        });

        let rets = solve([
            ['domain', x, [3, 4]]
        ], [w]);

        assert.deepEqual(rets, [
            [
                [3, [1, 2, 3]],
                [4, [1, 2, 3, 4]]
            ]
        ]);
    });
});
