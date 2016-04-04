'use strict';

const assert = require('assert'),
      http = require('http'),
      server = require('../server');

before(function () {
    server.listen(3333);
    http.globalAgent.options.port = 3333;
});

after(function () {
    server.close();
});

describe('/games', function () {
    describe('POST', function () {
        it('creates a new player and game', function (done) {
            var req = http.request({path: '/games', method: 'POST'}, (res) => {
                assert.equal(201, res.statusCode);
                console.log(res.headers.location);
                assert.ok(
                    (new RegExp('/games/[^/]+$')).test(res.headers.location)
                );

                var responseBody = '';
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    const gameSetup = JSON.parse(responseBody);
                    console.log(gameSetup);
                    assert.notEqual(undefined, gameSetup.playerId);
                    assert.notEqual(undefined, gameSetup.secret);
                    done();
                });
            });

            req.on('error', (e) => {
                throw e;
            });

            req.end();
        });
    });
});
