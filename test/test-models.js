'use strict';

const models = require('../models/index');
const Player = models.Player;

const assert = require('assert');

describe('Player', function () {
    describe('.create', function () {
        it('saves a new player', function (done) {
            Player.create({
                secret: 'foo'
            }).then(function (player) {
                assert.equal('foo', player.secret);
                done();
            });
        });
    });
});
