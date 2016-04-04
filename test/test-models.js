'use strict';

const models = require('../models/index'),
      Player = models.Player,
      Game = models.Game;

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

describe('Game', function () {
    describe('.create', function () {
        it('creates a new game', function (done) {
            Player.create({secret: 'foo'}).then(function (player) {
                return Game.create({player1: player});
            }).then(function (game) {
                // ?
                done();
            });
        });
    });
});
