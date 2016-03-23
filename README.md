Battleship API
==============

A practise project to work on Node.js, Express, etc.

See: https://en.wikipedia.org/wiki/Battleship_(game)

The [requirements](/REQUIREMENTS.md) are based on a Rails coding exercise I was
given as part of a job application.


Overview
--------

Clients periodically poll `/games/:id` to check on the current state of a game.
(An improved version might involve websockets or some other callback mechanism
to signal a change in the game state.)

A game can be in one of the following states:

 * `joining`&mdash;waiting for player 2 to join
 * `arranging`&mdash;waiting for players to submit their ship layouts
 * `in-progress`&mdash;players are alternately submitting moves
 * `finished`&mdash;one of the players has won

When `in-progress`, a game has an active player. Only that player can submit the
next move. Players alternate until the game reaches a `finished` state.


Game setup
----------

 * Player 1 creates a new game by `POST`ing to `/games` and receiving the game
   URL, which is shared with player 2 (see note 1). Example response:
   ```json
   {
       "url": "http://example.com/games/2",
       "secret": "abc123",
       "playerId": "1"
   }
   ```

 * Player 2 joins the game by `POST`ing to `/games/:id/players`. If another
   player has already joined, the request is rejected. Example response:
   ```json
   {
       "secret": "xzy456",
       "playerId": "2"
   }
   ```

 * Subsequent requests to any endpoint must include the secret and the player ID
   (see Authentication).

 * Once both players have joined, they arrange their ships (client-side) and
   send the ship locations by `PUT`ing to `/games/:id/players/:id/layout`. The
   coordinates are specified as 2-element arrays. Example request:
   ```json
   {
       "layout": [
           [[3, 3], [3, 4], [3, 5], [3, 6], [3, 7]],
           [[1, 0], [2, 0], [3, 0], [4, 0]],
           [[6, 7], [6, 8], [6, 9]],
           [[3, 9], [4, 9], [5, 9]],
           [[8, 2], [9, 2]]
       ]
   }
   ```
   This represents the following board arrangement:
   ```
     0 1 2 3 4 5 6 7 8 9
    +-------------------
   0|~ X X X X ~ ~ ~ ~ ~
   1|~ ~ ~ ~ ~ ~ ~ ~ ~ ~
   2|~ ~ ~ ~ ~ ~ ~ ~ X X
   3|~ ~ ~ X ~ ~ ~ ~ ~ ~
   4|~ ~ ~ X ~ ~ ~ ~ ~ ~
   5|~ ~ ~ X ~ ~ ~ ~ ~ ~
   6|~ ~ ~ X ~ ~ ~ ~ ~ ~
   7|~ ~ ~ X ~ ~ ~ X X X
   8|~ ~ ~ ~ ~ ~ ~ ~ ~ ~
   9|~ ~ ~ X X X ~ ~ ~ ~
   ```
   Multiple or invalid requests to this endpoint are rejected.


Playing
-------

 * Clients poll `/games/:id` to get a snapshot of the current game state.
   Example response:
   ```json
   {
       "state": "in-progress",
       "currentPlayerId": "2",
       "lastMove": {
           "target": [3, 2],
           "result": "miss"
       }
   }
   ```

 * When a client notices that `currentPlayerId` matches their assigned ID, they
   may `POST` moves to `/games/:id/moves`. Example request:
   ```json
   {
       "target": [4, 5]
   }
   ```
   Example response for a miss:
   ```json
   {
       "result": "miss"
   }
   ```
   Example response for a hit:
   ```json
   {
       "result": "hit"
   }
   ```
   Example response for a critical hit:
   ```json
   {
       "result": "hit",
       "sunk": "battleship",
   }
   ```

 * A game-ending hit is revealed by the next poll of the game status, which
   transitions to `finished`.


Authentication
--------------

Each player is assigned an ID that is unique (at least in the context of one
game) and a shared secret. These two values should be used as the username and
password fields in an HTTP Basic authorization header.

E.g. given user ID `1` and secret `abc123`, the resulting header is:
```
Authorization: Basic MTphYmMxMjMK
```
where `MTphYmMxMjMK` is the base64 encoding of `1:abc123`.


Notes
-----

 1. An endpoint could be implemented that provides the games that player 2 can
    join (e.g. `/games/available`). For now, the signup URL is provided to
    player 2 out-of-band.
