'use strict';

const _ = require('lodash'),
      db = require('./database'),
      Sequelize = require('sequelize');

const Player = db.define('player', {
    secret: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

let CoordinateType = {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {min: 0, max: 9}
};

const Ship = db.define('ship', {
    type: {
        type: Sequelize.ENUM(
            'carrier',
            'battleship',
            'submarine',
            'destroyer',
            'patrol'
        ),
        allowNull: false
    },
    fromX: _.clone(CoordinateType),
    fromY: _.clone(CoordinateType),
    toX: _.clone(CoordinateType),
    toY: _.clone(CoordinateType)
});
Ship.belongsTo(Player, {
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE'
});

const Game = db.define('game', {
    state: {
        type: Sequelize.ENUM(
            'joining',
            'arranging',
            'in-progress',
            'finished'
        ),
        allowNull: false,
        defaultValue: 'joining'
    }
});
Game.belongsTo(Player, {
    as: 'player1',
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE'
});
Game.belongsTo(Player, {
    as: 'player2',
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE'
});

const Move = db.define('move', {
    x: _.clone(CoordinateType),
    y: _.clone(CoordinateType)
});
Move.belongsTo(Player, {
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE'
});

module.exports = {
    Player, Ship, Game, Move
};
