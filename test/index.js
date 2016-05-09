'use strict';

let index = require('../index.js');
let assert = require('assert');

let defVar = index.defVar;
let solve = index.solve;
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

    it('error defVar transition', (done) => {
        try {
            defVar(1, 2);
        } catch (err) {
            if(err.toString().indexOf('Expect function for last arguments of defVar') !== -1) {
                done();
            } else {
                done(err);
            }
        }
    });

    it('error defVar deps', (done) => {
        try {
            defVar(1, () => {});
        } catch (err) {
            if(err.toString().indexOf('Expect variable') !== -1) {
                done();
            } else {
                done(err);
            }
        }
    });

    it('error domain', (done) => {
        try {
            domain(1);
        } catch (err) {
            if(err.toString().indexOf('Expect variable') !== -1) {
                done();
            } else {
                done(err);
            }
        }
    });

    it('error domain', (done) => {
        try {
            let x = defVar();
            domain(x, 1);
        } catch (err) {
            if(err.toString().indexOf('Expect variable or array for domain') !== -1) {
                done();
            } else {
                done(err);
            }
        }
    });

    it('error solve', (done) => {
        try {
            let x = defVar();
            solve([], [x]);
        } catch (err) {
            if(err.toString().indexOf('can not solve variable') !== -1) {
                done();
            } else {
                done(err);
            }
        }
    });
});
