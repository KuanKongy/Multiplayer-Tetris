import React, { useEffect, useCallback, useState } from "react";

import { useTetris, findDropPosition, addShapeToBoard } from "../../Hooks/useTetris";
import Board from "../Board";
import UpcomingBlocks from "../NextTetromino/UpcomingBlocks";
import { GhostCell, BoardType } from "../Types";
import Highscore from "../HighScore/Highscore";
import HighscoreModal from "../HighScoreModal/HighscoreModal";
import Display from "../Display/Display";
import { StyledTetrisWrapper, StyledTetris } from "./Tetris.styles";
import StartButton from "../StartButton/StartButton";
import HoldBlocks from "../NextTetromino/HoldBlocks";
import BackgroundMusic from "../BackgroundMusic/BackgroundMusic";

const Tetris = ({
  events,
  nPlayers,
  highscores,
  handleHighscore,
  index
}) => {
  const [showModal, setShowModal] = useState(false);
  const {startGame, isPlaying, score, upcomingBlocks, holdBlocks, lines, level, board, droppingBlock, droppingShape, droppingRow, droppingColumn} = useTetris(setShowModal);

  const serializeGameState = useCallback(() => {
    return { board, isPlaying, droppingBlock, droppingShape, droppingRow, droppingColumn, score, lines, level };
  }, [board, isPlaying, droppingBlock, droppingShape, droppingRow, droppingColumn, score, lines, level]);

  useEffect(() => {
    if (nPlayers > 1) {
      const state = serializeGameState();
      events.emit("state", state);
    }
    // eslint-disable-next-line
  }, [nPlayers, events]); //serializeGameState

  useEffect(() => {
    events.emit("isPlaying", isPlaying);
  }, [events, isPlaying]);

  useEffect(() => {
    events.emit("score", score);
  }, [events, score]);

  useEffect(() => {
    events.emit("lines", lines);
  }, [events, lines]);

  useEffect(() => {
    events.emit("level", level);
  }, [events, level]);

  useEffect(() => {
    events.emit("board", board);
  }, [events, board]);

  useEffect(() => {
    events.emit("droppingBlock", droppingBlock);
  }, [events, droppingBlock, isPlaying]);

  useEffect(() => {
    events.emit("droppingShape", droppingShape);
  }, [events, droppingShape]);

  useEffect(() => {
    events.emit("droppingRow", droppingRow);
  }, [events, droppingRow]);

  useEffect(() => {
    events.emit("droppingColumn", droppingColumn);
  }, [events, droppingColumn]);

  const onSubmitHighscore = name => {
    setShowModal(false);
    name = name.substring(0, 17);
    const highscoreItem = { name, score };
    const newHighscoreArr = [...highscores, highscoreItem];
    newHighscoreArr.sort((a, b) => b.score - a.score);
    if (newHighscoreArr.length > 5) newHighscoreArr.pop();
    handleHighscore(newHighscoreArr);
  };

  const renderedBoard = structuredClone(board);
  if (isPlaying) {
    let i = findDropPosition(renderedBoard, droppingShape, droppingRow, droppingColumn);
    addShapeToBoard( //renderGhost
        renderedBoard,
        GhostCell.Ghost,
        droppingShape,
        i,
        droppingColumn
    );
    addShapeToBoard(
        renderedBoard,
        droppingBlock,
        droppingShape,
        droppingRow,
        droppingColumn
    );
  }

  return (
  <StyledTetrisWrapper nPlayers={nPlayers}>
    <StyledTetris>
      <aside className="next-tetrimino">
        <Display text={"Score"} value={score} />
        <Display text={"Lines"} value={lines} />
        <Display text={"Level"} value={level} />
        {showModal ? (
            <HighscoreModal submitName={onSubmitHighscore}/>
          ) : (
            <Highscore highscoreArray={highscores}/>
        )}
      </aside>

      <Board className="stage" currentBoard={renderedBoard} boardClass={BoardType.Local}/>
      <BackgroundMusic play={isPlaying} />

      <aside className="information">
          {isPlaying ? (
            <div>
              <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
              <HoldBlocks holdBlocks={holdBlocks} />
            </div>
          ) : (
            <StartButton clickHandle={startGame} />
          )}
      </aside>
    </StyledTetris>
  </StyledTetrisWrapper>
  );
};

export default Tetris;
