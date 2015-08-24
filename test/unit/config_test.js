// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
'use strict';

var Config = require('../../config.js');
var test = require('tape');

test('set and get interactions', function t(assert) {
    var config = new Config();

    var configKey = 'testconfig';
    var expectedVal = 100;
    config.set(configKey, expectedVal);

    assert.equals(expectedVal, config.get(configKey), 'set and get works');
    assert.end();
});

test('changed events', function t(assert) {
    assert.plan(2);

    var config = new Config();
    config.on('changed', onConfigChanged);
    var configKey = 'somekey';
    config.on('changed.' + configKey, onConfigKeyChanged);
    var configVal = 'someval';
    config.set(configKey, configVal); // this triggers change events *fingers crossed*

    assert.end();

    function onConfigChanged() {
        assert.pass('changed');
    }

    function onConfigKeyChanged() {
        assert.pass('key changed');
    }
});

test('seeds known config', function t(assert) {
    var knownKey = 'TEST_KEY';
    var knownVal = 200;
    var unknownKey = 'unknown';
    var unknownVal = 100;
    var seed = {};
    seed[knownKey] = knownVal;
    seed[unknownKey] = unknownVal;

    var config = new Config(seed);

    assert.equals(knownVal, config.get(knownKey), 'known config is seeded');
    assert.equals(undefined, config.get(unknownKey),
        'unknown config is not seeded');
    assert.end();
});

test('no seed is OK', function t(assert) {
    assert.doesNotThrow(function it() {
        /* jshint nonew: false */
        new Config(null);
    });
    assert.end();
});
