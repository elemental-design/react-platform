"use strict";
var ReactPrimitives;
try {
    // @ts-ignore
    ReactPrimitives = require('react-primitives');
}
catch (err) {
    // FIXME: Clean-up experimental stub if react-primitives isn't installed.
    // @ts-ignore
    ReactPrimitives = require('./Core');
}
module.exports = ReactPrimitives;
