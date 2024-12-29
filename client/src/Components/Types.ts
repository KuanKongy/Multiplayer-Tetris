// Tetrominos
export enum Block {
    I = 'I',
    J = 'J',
    L = 'L',
    O = 'O',
    S = 'S',
    Z = 'Z',
    T = 'T',
}

// Empty cell
export enum EmptyCell {
    Empty = 'Empty',
}

// Ghost cell
export enum GhostCell {
  Ghost = 'Ghost',
}

// Cell is either empty or part of a block 
export type CellOptions = EmptyCell | Block | GhostCell;

export type OccupiedCell = Block | GhostCell;

export enum BoardType {
  Local = 'Local',
  Opp = 'Opp',
}

// Board is a 2D array of cells
export type BoardShape = CellOptions[][];

export type BlockShape = boolean[][];

type ShapesObj = {
    [key in Block]: {
        shape: BlockShape;
    };
};

export const SHAPES: ShapesObj = {
    I: {
      shape: [
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false],
      ],
    },
    J: {
      shape: [
        [true, false, false],
        [true, true, true],
        [false, false, false],
      ],
    },
    L: {
      shape: [
        [false, false, true],
        [true, true, true],
        [false, false, false],
      ],
    },
    O: {
      shape: [
        [true, true],
        [true, true],
      ],
    },
    S: {
      shape: [
        [false, true, true],
        [true, true, false],
        [false, false, false],
      ],
    },
    Z: {
      shape: [
        [true, true, false],
        [false, true, true],
        [false, false, false],
      ],
    },
    T: {
        shape: [
          [false, true, false],
          [true, true, true],
          [false, false, false],
        ],
      },
  };