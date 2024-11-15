import { BoardShape } from './Types';
import Cell from './Cells';

// Props represents current state of a board
interface Props {
    currentBoard : BoardShape;
}

// Mapped board by horizontal lines, each having cells divided by vertical lines
function Board({ currentBoard } : Props) {
    return ( //style, board
        <div className="board"> 
            {currentBoard.map((row, rowIndex) => ( //map board by horizontal lines, rows (first array)
                <div className="row" key={`${rowIndex}`}> 
                    {row.map((cell, colIndex) => ( //map each row by vertical lines, columns (second array)
                        <Cell key={`${rowIndex}-${colIndex}`} type={cell}/> //indexed cells
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Board;




