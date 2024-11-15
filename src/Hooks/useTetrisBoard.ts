import { Dispatch, useReducer } from "react";
import { Block, BlockShape, BoardShape, EmptyCell, GhostCell, SHAPES } from "../Components/Types"; //modified
import { findDropPosition } from './useTetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type BoardState = {
    board : BoardShape;
    droppingRow : number;
    droppingColumn : number;
    droppingBlock : Block;
    droppingShape: BlockShape;
};

export function useTetrisBoard() : [BoardState, Dispatch<Action>] {
    const [boardState, dispathBoardState] = useReducer(
        boardReducer,
        {
            board: [],
            droppingRow: 0,
            droppingColumn: 0,
            droppingBlock: Block.I,
            droppingShape: SHAPES.I.shape,
        },
        (emptyState) => {
            const state = {
                ...emptyState,
                board: getEmptyBoard(),
            };
            return state;
        }
    );
    return [boardState, dispathBoardState];
}

export function getEmptyBoard(height = BOARD_HEIGHT) : BoardShape {
    return Array(height) //fake 2D array, stub
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}

export function hasCollisions(
    board: BoardShape,
    currentShape: BlockShape,
    row: number,
    column: number
): boolean {
    let hasCollisions = false;
    currentShape
        .filter((shapeRow) => shapeRow.some((isSet) => isSet))
        .forEach((shapeRow: boolean[], rowIndex: number) => {
            shapeRow.forEach((isSet: boolean, colIndex: number) => {
                if (isSet && 
                    (row + rowIndex >= board.length || 
                        column + colIndex >= board[0].length ||
                        column + colIndex < 0 ||
                        (board[row + rowIndex][column + colIndex] !== EmptyCell.Empty && 
                        board[row + rowIndex][column + colIndex] !== GhostCell.Ghost)) //modified
                ) {
                    hasCollisions = true;
                }
            });
        });
    return hasCollisions;
}

export function getRandomBlock(): Block {
    const blockValues = Object.values(Block);
    return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}

function rotateBlockRight(shape: BlockShape): BlockShape {
    const rows = shape.length;
    const columns = shape[0].length;
    const rotated = Array(rows)
        .fill(null)
        .map(() => Array(columns).fill(false));
    
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            rotated[column][rows - 1 - row] = shape[row][column];
        }
    }

    return rotated;
}

function rotateBlockLeft(shape: BlockShape): BlockShape {
    const rows = shape.length;
    const columns = shape[0].length;
    const rotated = Array(rows)
        .fill(null)
        .map(() => Array(columns).fill(false));
    
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            rotated[columns - 1 - column][row] = shape[row][column];
        }
    }

    return rotated;
}

type Action = {
    type: 'start' | 'drop' | 'commit' | 'move';
    newBoard?: BoardShape;
    newBlock?: Block;
    isPressingLeft?: boolean;
    isPressingRight?: boolean;
    isRotatingRight?: boolean;
    isRotatingLeft?: boolean;
    isHardDropping?: boolean;
};

function boardReducer(state: BoardState, action: Action) : BoardState {
    let newState = { ...state };

    switch (action.type) {
        case 'start':
            const firstBlock = getRandomBlock();
            return {
                board: getEmptyBoard(),
                droppingRow:  0,    //top
                droppingColumn: 3,  //center
                droppingBlock: firstBlock,
                droppingShape: SHAPES[firstBlock].shape,
            };
        case 'drop':
            newState.droppingRow++;
            break;
        case 'commit':
            return {
                board: [
                    ...getEmptyBoard(BOARD_HEIGHT - action.newBoard!.length),
                    ...action.newBoard!,
                ],
                droppingRow: 0,
                droppingColumn: 3,
                droppingBlock: action.newBlock!,
                droppingShape: SHAPES[action.newBlock!].shape,
            };
        case 'move':
            let rotatedShape = newState.droppingShape;
            if (action.isRotatingRight) {
                rotatedShape = rotateBlockRight(newState.droppingShape);
            } else if (action.isRotatingLeft) {
                rotatedShape = rotateBlockLeft(newState.droppingShape);
            }
            // const rotatedShape = action.isRotatingRight
            //     ? rotateBlockRight(newState.droppingShape)
            //     : newState.droppingShape;
            let columnOffset = action.isPressingLeft ? -1 : 0;
            columnOffset = action.isPressingRight ? 1 : columnOffset;
            const droppedRows = action.isHardDropping
            ? findDropPosition(newState.board, newState.droppingShape, newState.droppingRow, newState.droppingColumn)
            : newState.droppingRow;
            if (
                !hasCollisions(
                    newState.board,
                    rotatedShape,
                    droppedRows,
                    newState.droppingColumn + columnOffset
                )
            ) {
                newState.droppingColumn += columnOffset;
                newState.droppingShape = rotatedShape;
                newState.droppingRow = droppedRows;
            }
            break;
        default:
            const unhandledType: never = action.type;
            throw new Error(`Unhandled action type: ${unhandledType}`);
    }

    return newState
}