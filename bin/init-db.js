#!/usr/bin/env node

'use strict';

var models = require('../models/index');

models.Player.sync({force: true});
models.Ship.sync({force: true});
models.Game.sync({force: true});
models.Move.sync({force: true});
