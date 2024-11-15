import { useCallback, useEffect, useState } from "react";
import { BOARD_HEIGHT, getEmptyBoard, getRandomBlock, hasCollisions, useTetrisBoard } from "./useTetrisBoard";
import { useInterval } from "./useInterval";
import { Block, BlockShape, BoardShape, EmptyCell, GhostCell, OccupiedCell, SHAPES } from "../Components/Types"; //modified

enum TickSpeed {
    Normal = 800,
    Sliding = 1,
    Fast = 50,
}

const LEVELDIF = 75;
const MAXLEV = 11;

export function useTetris() {
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
    const [isCommitting, setIsCommitting] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);
    const [holdBlocks, setHoldBlocks] = useState<Block[]>([]);
    const [
        { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
        dispatchBoardState,
    ] = useTetrisBoard();
    const startGame = useCallback(() => {
        const startingBlocks = [
            getRandomBlock(),
            getRandomBlock(),
            getRandomBlock(),
        ];
        const startingHoldBlocks = [] as Block[];
        setUpcomingBlocks(startingBlocks);
        setScore(0);
        setLines(0);
        setLevel(1);
        setIsPlaying(true);
        setIsCommitting(false);
        setIsHolding(false);
        setHoldBlocks(startingHoldBlocks);
        setTickSpeed(TickSpeed.Normal);
        dispatchBoardState({ type: 'start' });
    }, [dispatchBoardState]);

    const commitPosition = useCallback(() => {
        if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
            setIsCommitting(false);
            let speed = TickSpeed.Normal - ((level - 1) * LEVELDIF); //modified
            setTickSpeed(speed);
            return;
        }

        const newBoard = structuredClone(board) as BoardShape;
        addShapeToBoard(
            newBoard,
            droppingBlock,
            droppingShape,
            droppingRow,
            droppingColumn
        );

        let numCleared = 0;
        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
            if (newBoard[row].every((entry) => (entry !== EmptyCell.Empty && entry !== GhostCell.Ghost))) { //modified
                numCleared++;
                newBoard.splice(row, 1);
            }
        }

        const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
        const newBlock = newUpcomingBlocks.pop() as Block;
        newUpcomingBlocks.unshift(getRandomBlock());

        if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) { //if game over
            setIsPlaying(false);
            setTickSpeed(null);
        } else {
            let speed = TickSpeed.Normal - ((level - 1) * LEVELDIF); //modified
            setTickSpeed(speed);
        }

        let l = lines + numCleared;
        setScore((prevScore) => prevScore + getPoints(numCleared));
        setLines((prevLines) => prevLines + numCleared);
        setLevel((prevLevel) => getLevel(l, prevLevel));
        setUpcomingBlocks(newUpcomingBlocks);
        dispatchBoardState({ type: 'commit', newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard], newBlock, });
        setIsCommitting(false);
        setIsHolding(false);
    }, [board, dispatchBoardState, droppingBlock, droppingColumn, droppingRow, droppingShape, upcomingBlocks, lines, level]);

    const gameTick = useCallback(() => {
        if (isCommitting) {
            commitPosition();
        } else if (
            hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)
        ) {
            setTickSpeed(TickSpeed.Sliding);
            setIsCommitting(true);
        } else {
            dispatchBoardState({ type: 'drop' });
        }
    }, [board, commitPosition, dispatchBoardState, droppingColumn, droppingRow, droppingShape, isCommitting]);

    useInterval(() => {
        if (!isPlaying) {
            return;
        }
        gameTick();
    }, tickSpeed);

    useEffect(() => {
        if (!isPlaying) {
            return;
        }

        let isHardDropping = false;
        let isPressingLeft = false;
        let isPressingRight = false;
        let moveIntervalID: number | undefined;

        const updateMovementInterval = () => {
            clearInterval(moveIntervalID);
            dispatchBoardState({
                type: 'move',
                isPressingLeft,
                isPressingRight,
                isHardDropping,
            });
            moveIntervalID = window.setInterval(() => {
                dispatchBoardState({
                    type: 'move',
                    isPressingLeft,
                    isPressingRight,
                    isHardDropping,
                });
            }, 300);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) {
                return;
            }

            if (event.key === 'ArrowDown') {
                setTickSpeed(TickSpeed.Fast);
            }

            if (event.key === 'ArrowUp') {
                dispatchBoardState({
                    type: 'move',
                    isRotatingRight: true,
                });
            }

            if (event.key === 'x') {
                dispatchBoardState({
                    type: 'move',
                    isRotatingLeft: true,
                });
            }

            if (event.key === 'ArrowLeft') {
                isPressingLeft = true;
                updateMovementInterval();
            }

            if (event.key === 'ArrowRight') {
                isPressingRight = true;
                updateMovementInterval();
            }

            if (event.key === ' ') {
                isHardDropping = true;
                updateMovementInterval();
            }

            if (event.key === 'c' && !isHolding) { //Shift
                const newHoldBlocks = structuredClone(holdBlocks) as Block[];
                let j = newHoldBlocks.unshift(droppingBlock);
                let newBlock = Block.I;
                if (j === 1) {
                    setHoldBlocks(newHoldBlocks);
                    const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
                    newBlock = newUpcomingBlocks.pop() as Block;
                    newUpcomingBlocks.unshift(getRandomBlock());
                    setUpcomingBlocks(newUpcomingBlocks);
                } else if (j === 2) {
                    setIsHolding(true);
                    newBlock = newHoldBlocks.pop() as Block;
                    setHoldBlocks(newHoldBlocks);
                }
                const newBoard = structuredClone(board) as BoardShape;
                dispatchBoardState({ type: 'commit', newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard], newBlock, });
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'ArrowDown') {
                let speed = TickSpeed.Normal - ((level - 1) * LEVELDIF); //modified
                setTickSpeed(speed);
            }

            if (event.key === 'ArrowLeft') {
                isPressingLeft = false;
                updateMovementInterval();
            }

            if (event.key === 'ArrowRight') {
                isPressingRight = false;
                updateMovementInterval();
            }

            if (event.key === ' ') {
                isHardDropping = false;
                updateMovementInterval();
            }
        };


        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            clearInterval(moveIntervalID);
            let speed = TickSpeed.Normal - ((level - 1) * LEVELDIF); //modified
            setTickSpeed(speed);
        };
    }, [dispatchBoardState, isPlaying, droppingBlock, holdBlocks, board, upcomingBlocks, isHolding, level]);

    const renderedBoard = structuredClone(board) as BoardShape;
    let i = findDropPosition(renderedBoard, droppingShape, droppingRow, droppingColumn);
    
    if (isPlaying) {
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

    return {
        board: renderedBoard,
        startGame,
        isPlaying,
        score,
        upcomingBlocks,
        holdBlocks,
        lines,
        level,
    };
}

function getPoints(numCleared: number): number {
    switch (numCleared) {
      case 0:
        return 0;
      case 1:
        return 100;
      case 2:
        return 300;
      case 3:
        return 500;
      case 4:
        return 800;
      default:
        throw new Error('Unexpected number of rows cleared');
    }
}

function getLevel(lines: number, level: number): number {
    if (linesRequired(level + 1) > lines) {
        return level;
    } else {
        return Math.min(level + 1, MAXLEV);
    }
}

function linesRequired(level: number): number {
    if (level === 1) {
        return 0;
    }
    return linesRequired(level - 1) + 4 * (level - 1);
}

export function findDropPosition(
    board: BoardShape,
    currentShape: BlockShape,
    row: number,
    column: number
): number {
    for (let i = row + 1; i <= board.length; i++) {
        if (hasCollisions(board, currentShape, i, column)) {
            return i - 1;
        }
    }
    return 0;
}

function addShapeToBoard(
    board: BoardShape,
    droppingBlock: OccupiedCell,
    droppingShape: BlockShape,
    droppingRow: number,
    droppingColumn: number
) {
    droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
        row.forEach((isSet: boolean, colIndex: number) => {
            if (isSet) {
                board[droppingRow + rowIndex][droppingColumn + colIndex] = droppingBlock;
            }
        });
    });
}