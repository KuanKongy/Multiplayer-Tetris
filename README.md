# Tetris on React in Typescript

This is a clone of Tetris game implemented using Node.js for backend, and React.js for frontend.

Link: https://KuanKongy.github.io/Multiplayer-Tetris

### Included features
**Playfiled**: 10 cells wide and 20 cells tall.  
**Super Rotation System**: visual rotation only without kicks.  
**Tetromino starting position**: first two rows.  
**Lock Down**: piece has 0.5 seconds after landing to slide before it locks down.  
**Piece preview**: next queue with three next blocks
Hold: active piece can be inserted into hold queue. If there's already a piece, a current piece will be swapped. Only one piece can be in the hold queue. Only one swap can be done until another piece locks down.  
**Ghost piece**: position of piece if hard dropped, 0.5 seconds of sliding time applies.  
**Levels, scoring**: determined only by lines cleared. After each level, pieces fall faster, but sliding time doesn't change.  

### Controls
**Left and right arrow keys**: Piece shifting  
**Up arrow key**: Rotating 90 degrees clockwise  
**Down arrow key**: Soft drop  
**Space bar**: Hard drop  
**C key**: Hold piece  
**X key**: Rotating 90 degrees counterclockwise  

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
