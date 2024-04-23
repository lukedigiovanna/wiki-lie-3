# Wiki-Lie

This is a mono-repo containing a Solid.js frontend and Express/Socket.io backend for running Wiki-Lie.

The backend interfaces with a redis cache to keep track of game state and in turn makes the entire 
application stateless.

## History

Wiki-lie is a game inspired from the Tom Scott web series "Two of these people are lying", you can view all their episodes
[here](https://www.youtube.com/playlist?list=PLfx61sxf1Yz2I-c7eMRk9wBUUDCJkU7H0).

The premise of the game is fairly simple. One person is chosen as the judge and then each other player finds a niche 
Wikipedia article and reads a bit about it. Then one of these articles is chosen at random (the judge doesn't know
who's article is who's). Each of the players then tries to convince the judge they know what the article is about
by describing it. And of course, here is where bulshitting skills come into play - if it's not your article, then you
have to make something up on the spot.

A few years ago when I first saw these videos, I was really interested in playing the game myself. So I forced some of my friends
to sit down and we individually searched for articles, wrote the title down, put it in a hat, and then had the judge select one
at random. This process was extremely cumbersome and inefficient. This type of game was ripe for a web interface that automizes
all of the annoying bits: finding a good article, choosing a random article, and keeping track of score. So I developed one iteration
using socket.io and jQuery (before I knew what a JS framework was). Too buggy and unmaintainable. So I tried again, this time using
express/socket.io/React. Again, too buggy, but definitely an improvement.

Now I think I have the requisite experience to fully develop this game and release it to the public.

## Frontend

### Solid.js

The bloat of React has turned me off for some time, so I am going to try using Solid.js for this.

## Backend

### Express

We use express to manage a node.js backend. Doesn't really do much except serve the `public_html` directory.

### Socket.io

We use socket.io to manage state synchronization across clients

#### Messages

From Client:

1. `join-game`: `{gameID, clientID}`
   1. If the game exists, it sends a message back to the client 
2. `create-game`: 
3. `choose-article`: `{clientID, articleName}`
4. `make-guess`: `{clientID}`

From Server:

1. `game-state`: `{<game-info>}`
   1. Sends an entire object representing the current state of the game a client is in
   2. Includes all relevant game information (i.e. game settings, whether the game is started, chosen article, host, players, etc.)

### Redis

The actual state of the game is stored in a redis cache. This enables the server to be stateless and scalable.

Redis has sub-millisecond access, so this works fine.