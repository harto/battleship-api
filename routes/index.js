'use strict';

const express = require('express'),
      router = express.Router(),
      models = require('../models/index'),
      db = require('../models/database');

router.get('/', function(req, res) {
    res.json({title: 'Battleship'});
});

router.post('/games', function (req, res) {
    return db.transaction(function (t) {
        return models.Player.create({
            secret: 'fixme'
        }, {transaction: t}).then(function (player) {
            return models.Game.create({

            });
        });
    }).then(function (result) {
        res.statusCode = 201;
        // fixme; location needs full URL
        // fixme; use named routes
        res.setHeader('Location', '/games/' + 'fixme');
        res.json(result);
    }).catch(function (e) {
        if (e instanceof db.ValidationError) {
            res.statusCode = 400;
            res.json(e);
        } else {
            throw e;
        }
    });
});

module.exports = router;
