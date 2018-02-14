Just Soda
=========

A front-end for my helping teach my programming languages class. Add a cell, edit in real time in with the rest of the class, and run your code in the browser (via RexTester). The shared session is hidden behind a light wall of security via a totally top secret "room key" URL.


Files
-----

On the front-end:
- `public/client.js`, front-end logic for polling the server, keeping the UI in sync between the clients, and adding new cells
- `public/style.css`, lots of float left
- `views/app.html`, the html for just the "spawner" cell for adding new cells; the rest are added via `client.js`
- `views/sorry.html`, the 404 page

On the back-end:
- `server.js`, back-end logic for keeping the clients' data in sync, loading examples from the `examples/` folder when a cell is just created, and serving files in general
- `package.json`, specifies that we just need the express and express rate limit node packages
- `.env`, secret file for listing the "room key"

Others:
- `examples/`, stores the default code for each language supported
- `CODE_OF_CONDUCT.md`, follow the rules
- `LICENSE.md`, follow the law

\ ゜o゜)ノ
