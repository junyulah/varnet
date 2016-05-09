# varnet

A generic approach to solve variables.

[![Build Status](https://travis-ci.org/LoveKino/varnet.svg)](https://travis-ci.org/LoveKino/varnet.svg)
[![Coverage Status](https://coveralls.io/repos/github/LoveKino/varnet/badge.svg?branch=master)](https://coveralls.io/github/LoveKino/varnet?branch=master)


## A thought to solve problems

- step1: define variables

When define a variable, need to specify:
(1) which variables it depends on.
(2) how to solve variable, if you know the values of variables it depends on.

- step2: instantiate some variables and get target variables.

## install

`npm i varnet --save`

## defVar and solve api

- var y = defVar(...vars, transition)

Vars are the variables y depends on.

Transition is a function, which used to solve variable. It accepts params which stand for the instances of dependent variables. The return of transition is variable's solution.

The defVar can accept zero parameters.

- var ret = solve([[variable, instance], ...], [variable, ...])

This api used to solve problem. It accepts two parameters.

First one: [[variable, instance], ...], is an array. Every item is an array too contain two elements. First element is variable, the second is the instance of the variable. The param stands for some instantiated variables.

Second one: [variable, ...] is an array. Every item is a variable. It declares which variables we want to solve. We called thoese variables as target variables.

The result of solve is an array contains the solution of every target variable.

If there is no solution (lack of variable's instance), will throw an Error.

## example

- eg: solve y, y =  x * x, when x is 10

```js
var varnet = require('varnet');
var defVar = varnet.defVar;
var solve = varnet.solve;

// define variables
var x = defVar();
var y = defVar(x, (x) => x * x);

// solve
var ret = solve([
    [x, 10]
], [y]);

console.log(ret); // [10]
```

- eg: solve r, z, r = w - z, z = x + y, y = x * x, when x is 5, w is 7

```js
var varnet = require('varnet');
var defVar = varnet.defVar;
var solve = varnet.solve;

// define variables
var x = defVar();
var y = defVar(x, (x) => x * x);
var z = defVar(x, y, (x, y) => x + y);
var w = defVar();
var r = defVar(w, z, (w, z) => w - z);

// solve
var ret = solve([
    [x, 5],
    [w, 7]
], [r, z]); // [-23, 30]

var ret2 = solve([
    [x, 2],
    [w, 10]
], [r, z]); // [4, 6]
```

See, you do not need to do any composation of transition or even calculation, you just define variables, then call solve function.

## domain and predicate apis

You can declare the domain of a variable, and use a couple of predicates to variable.

## any

- eg: y = ∀ x ∈ X, x > 10

```js
let x = defVar();
let y = defVar(any(x), (x) => x > 10);

let rets = solve([
    ['domain', x, [2, 4, 6]]
], [y]); // [false]

let rets2 = solve([
    ['domain', x, [12, 14, 16]]
], [y]); // [true]
```

- eg: ∀ x ∈ X, y ∈ [1, 5, x], x + y > 6

```js
let x = defVar();
let Y = defVar(x, (x) => [1, 5, x]);
let y = defVar();
domain(y, Y);

let z = defVar(any(x), any(y), (x, y) => x + y > 6);
solve([
    ['domain', x, [7, 8]]
], [z]); // [true]
```

## other predicates just like any. exist, map, ...
