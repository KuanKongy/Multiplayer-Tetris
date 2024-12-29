import { useCallback, useEffect, useState } from "react";
import { BOARD_HEIGHT, getEmptyBoard, hasCollisions, useTetrisBoard } from "./useTetrisBoard";
import { useInterval } from "./useInterval";
import { Block, BlockShape, BoardShape, EmptyCell, GhostCell, OccupiedCell, SHAPES } from "../Components/Types";
//import { useBag } from "./useBag";

enum TickSpeed {
    Normal = 800,
    Sliding = 1,
    Fast = 50,
}

const LEVELDIF = 200;
const MAXLEV = 11;

export function useTetris(callback: (arg: boolean) => void) {
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
    const [isCommitting, setIsCommitting] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);
    const [holdBlocks, setHoldBlocks] = useState<Block[]>([]);
    const [sevenBlocks, setSevenBlocks] = useState<Block[]>([]);
    const [
        { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
        dispatchBoardState,
    ] = useTetrisBoard();

    const refillBag = useCallback((): Block[] => {
        const blocks: Block[] = Object.values(Block);
        const shuffledBag = shuffleArray(blocks);
        return shuffledBag;
    }, []);

    const getNextBlock = useCallback((array: Block[]): Block => {
        if (array.length === 0) {
            array = refillBag();
        }
        const newSevenBlocks = structuredClone(array) as Block[];
        const newBlock = newSevenBlocks.pop() as Block;
        setSevenBlocks(newSevenBlocks);
        return newBlock;
    }, [setSevenBlocks, refillBag]);

    const startGame = useCallback(() => {
        const initialBag = refillBag();
        const startingBlocks = [
            initialBag.pop() as Block,
            initialBag.pop() as Block,
            initialBag.pop() as Block,
        ];
        const startingHoldBlocks = [] as Block[];
        const newBlock = initialBag.pop();
        setSevenBlocks(initialBag);
        setUpcomingBlocks(startingBlocks);
        setScore(0);
        setLines(0);
        setLevel(1);
        setIsPlaying(true);
        setIsCommitting(false);
        setIsHolding(false);
        setHoldBlocks(startingHoldBlocks);
        setTickSpeed(TickSpeed.Normal);
        dispatchBoardState({ type: 'start', newBlock});
        callback(false);
    }, [dispatchBoardState, callback, refillBag]);

    const commitPosition = useCallback(() => {
        if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
            setIsCommitting(false);
            let speed = TickSpeed.Normal - ((level - 1) * LEVELDIF);
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
            if (newBoard[row].every((entry) => (entry !== EmptyCell.Empty && entry !== GhostCell.Ghost))) {
                numCleared++;
                newBoard.splice(row, 1);
            }
        }

        const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
        const newBlock = newUpcomingBlocks.pop() as Block;
        newUpcomingBlocks.unshift(getNextBlock(sevenBlocks));

        if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) { //if game over
            setIsPlaying(false);
            setTickSpeed(null);
            callback(true);
        } else {
            let speed = TickSpeed.Normal - ((level - 1) * LEVELDIF);
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
    }, [board, dispatchBoardState, callback, getNextBlock, sevenBlocks, droppingBlock, droppingColumn, droppingRow, droppingShape, upcomingBlocks, lines, level]);

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

            if (event.keyCode === 40) { //ArrowDown
                setTickSpeed(TickSpeed.Fast);
            }

            if (event.keyCode === 38) { //ArrowUp
                dispatchBoardState({
                    type: 'move',
                    isRotatingRight: true,
                });
            }

            if (event.keyCode === 88) { //x
                dispatchBoardState({
                    type: 'move',
                    isRotatingLeft: true,
                });
            }

            if (event.keyCode === 37) { //ArrowLeft
                isPressingLeft = true;
                updateMovementInterval();
            }

            if (event.keyCode === 39) { //ArrowRight
                isPressingRight = true;
                updateMovementInterval();
            }

            if (event.keyCode === 32) { //Space
                setTickSpeed(TickSpeed.Sliding);
                isHardDropping = true;
                updateMovementInterval();
            }

            if (event.keyCode === 67 && !isHolding) { //c
                const newHoldBlocks = structuredClone(holdBlocks) as Block[];
                let j = newHoldBlocks.unshift(droppingBlock);
                let newBlock = Block.I;
                if (j === 1) {
                    setHoldBlocks(newHoldBlocks);
                    const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
                    newBlock = newUpcomingBlocks.pop() as Block;
                    newUpcomingBlocks.unshift(getNextBlock(sevenBlocks));
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
            if (event.keyCode === 40) { //ArrowDown
                let speed = TickSpeed.Normal - ((level - 1) * LEVELDIF);
                setTickSpeed(speed);
            }

            if (event.keyCode === 37) { //ArrowLeft
                isPressingLeft = false;
                updateMovementInterval();
            }

            if (event.keyCode === 39) { //ArrowRight
                isPressingRight = false;
                updateMovementInterval();
            }

            if (event.keyCode === 32) { //Space
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
            let speed = TickSpeed.Normal - ((level - 1) * LEVELDIF);
            setTickSpeed(speed);
        };
    }, [dispatchBoardState, getNextBlock, sevenBlocks, isPlaying, droppingBlock, holdBlocks, board, upcomingBlocks, isHolding, level]);

    return {
        startGame,
        isPlaying,
        score,
        upcomingBlocks,
        holdBlocks,
        lines,
        level,
        board, 
        droppingBlock, 
        droppingShape, 
        droppingRow, 
        droppingColumn
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

export function addShapeToBoard(
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

function shuffleArray(array: Block[]): Block[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}