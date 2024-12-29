import React, { useState, useEffect } from "react";
import { getEmptyBoard } from "../../Hooks/useTetrisBoard";
import { findDropPosition, addShapeToBoard } from "../../Hooks/useTetris";
import Board from "../Board";
import { Block, SHAPES, GhostCell, BoardType } from "../Types";
import { StyledTetrisWrapper, StyledTetris } from "./Tetris.styles";
import Display from "../Display/Display";

const TetrisOpp = ({
  gameState,
  nPlayers,
  index
}) => {
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState(getEmptyBoard());
  const [isPlaying, setIsPlaying] = useState(false);
  const [droppingBlock, setDroppingBlock] = useState(Block.I);
  const [droppingShape, setDroppingShape] = useState(SHAPES.O.shape);
  const [droppingRow, setDroppingRow] = useState(5);
  const [droppingColumn, setDroppingColumn] = useState(5);

  useEffect(() => {
    if (gameState.board !== undefined) setBoard(gameState.board);
    if (gameState.score !== undefined) setScore(gameState.score);
    if (gameState.lines !== undefined) setLines(gameState.lines);
    if (gameState.level !== undefined) setLevel(gameState.level);
    if (gameState.isPlaying !== undefined) setIsPlaying(gameState.isPlaying);
    if (gameState.droppingBlock !== undefined) setDroppingBlock(gameState.droppingBlock);
    if (gameState.droppingShape !== undefined) setDroppingShape(gameState.droppingShape);
    if (gameState.droppingRow !== undefined) setDroppingRow(gameState.droppingRow);
    if (gameState.droppingColumn !== undefined) setDroppingColumn(gameState.droppingColumn);
  }, [
    gameState.board,
    gameState.score,
    gameState.lines,
    gameState.level,
    gameState.isPlaying,
    gameState.droppingBlock,
    gameState.droppingShape,
    gameState.droppingRow,
    gameState.droppingColumn,
    setBoard,
    setScore,
    setLines,
    setLevel,
    setIsPlaying,
    setDroppingBlock,
    setDroppingShape,
    setDroppingRow,
    setDroppingColumn
  ]);

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
        </aside>

        <Board className="stage" currentBoard={renderedBoard} boardClass={BoardType.Opp}/>

        <aside className="information">

        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default TetrisOpp;
