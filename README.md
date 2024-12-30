# Multiplayer Tetris on React in Typescript

This is a clone of Tetris game designed using React, Node.js. Server is implemented using Express.js, Socket.IO.  
Highscore database uses Firebase Firestore. Styling was done using Styled Components.

Link to play tetris (singleplayer always active): https://KuanKongy.github.io/Multiplayer-Tetris  
Link to start server for multiplayer: https://multiplayer-tetris-bd80c58c0ffa.herokuapp.com/

## How to Play
To playe globally, use provided links. To play locally, download the project, uncomment line 22 in TetrisManager.jsx, and run in console "npm start" in both client and server directories.  

When the game starts you get a unique url that identifies your game session, (e.g. "http://localhost:3001/#oyxadn" or "https://KuanKongy.github.io/Multiplayer-Tetris/#oyxadn"), if you share your url or open it up in a new window, several Tetris games should be in the same session. Game session has default limit of 2 players; which is expandable in main.js in server folder.

### Included features
**Playfiled**: 10 cells wide and 20 cells tall.  
**Super Rotation System**: visual rotations, without kicks.  
**Tetromino starting position**: first two rows.  
**Lock Down**: piece has 0.5 seconds after landing to slide before it locks down.  
**Piece preview**: next queue with three next blocks.  
**Hold**: active piece can be inserted into hold queue. If there's already a piece, a current piece will be swapped. Only one piece can be in the hold queue. Only one swap can be done until another piece locks down.  
**Random generator**: 7 bag system. One of each of the 7 tetrominoes are shuffled in a "bag", and are dealt out one by one. When the bag is empty, a new one is filled and shuffled.  
**Ghost piece**: position of piece if hard dropped, 0.5 seconds of sliding time doesn't apply.  
**Levels, scoring**: determined by lines cleared. After each level, pieces fall faster, but sliding time doesn't change.  

### Controls
**Left and right arrow keys**: Piece shifting  
**Up arrow key**: Rotating 90 degrees clockwise  
**Down arrow key**: Soft drop  
**Space bar**: Hard drop  
**C key**: Hold piece  
**X key**: Rotating 90 degrees counterclockwise  

## Available Scripts

In the project directory, for both client and server, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## TODO

- implement wall kicks for SRS
- add Tetris logo
- implement matchmaking