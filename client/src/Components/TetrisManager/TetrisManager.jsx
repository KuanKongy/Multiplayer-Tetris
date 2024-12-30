import React from "react";

import Tetris from "../Tetris/Tetris";
import TetrisOpp from "../Tetris/TetrisOpp";
import Events from "../../utils/events";
import ConnectionManager from "../../utils/connectionManager";
import { StyledTetrisManager } from "./TetrisManager.styles";
import { getEmptyBoard } from "../../Hooks/useTetrisBoard";

class TetrisManager extends React.Component {
  constructor() {
    super();
    this.state = {
      players: new Map(),
      highscores: []
    };
  }

  componentDidMount() {
    this.createPlayer();
    this.connectionManager = new ConnectionManager(this);
    //this.connectionManager.connect("ws://localhost:3000"); //uncomment this if you want to play locally
    //this.connectionManager.connect("ws://192.168.0.16:3000");
    //this.connectionManager.connect("wss://multiplayer-tetris-bd80c58c0ffa.herokuapp.com/");
    this.connectionManager.connect("https://multiplayer-tetris-bd80c58c0ffa.herokuapp.com/"); //uncomment this if you want to play globally
  }

  connectToServer = () => {
  };

  setHighscore = newHighscore => this.setState({ highscores: newHighscore });

  onSubmitHighscore = newHighscoreArr => {
    this.sendDataToServer({
      type: "update-highscore",
      list: newHighscoreArr
    });
  };

  sendDataToServer = data => {
    if (this.connectionManager) {
      this.connectionManager.send(data);
    }
  };

  createPlayer = (playerId = "localPlayer") => {
    const events = new Events();
    const isLocalPlayer = this.state.players.size === 0 ? true : false;
    const board = getEmptyBoard();
    const lines = 0;
    const score = 0;
    const level = 1;
    const gameState = { board, score, lines, level };
    this.setState(prev =>
      prev.players.set(playerId, { events, isLocalPlayer, gameState })
    );
  };

  removePlayer = id => {
    this.setState(prev => prev.players.delete(id));
  };

  sortPlayers = players => {
    this.setState(prevState => {
      const sortedMap = new Map(
        players.map(key => [key, prevState.players.get(key)])
      );
      return { players: sortedMap };
    });
  };

  updateTetrisState = (id, newState) => {
    const player = this.state.players.get(id);
    try {
      player.gameState = {
        ...player.gameState,
        [newState.prop]: newState.value
      };
    } catch (error) {
      console.log("Undefined object");
    }
    this.setState(prev => prev.players.set(id, player));
  };

  render() {
    return (
      <StyledTetrisManager>
        {([
              ...this.state.players.entries()
            ].map(([playerId, { events, isLocalPlayer, gameState }], index) => (
              <aside className="information">
                {isLocalPlayer ? (
                  <Tetris
                  key={playerId}
                  events={events}
                  nPlayers={this.state.players.size}
                  highscores={this.state.highscores}
                  handleHighscore={this.onSubmitHighscore}
                  index={index}
                />
                ) : (
                  <TetrisOpp
                  key={playerId}
                  gameState={gameState}
                  nPlayers={this.state.players.size}
                  index={index}
                />
                )}
              </aside>
            ))
          )}
      </StyledTetrisManager>
    );
  }
}

export default TetrisManager;
