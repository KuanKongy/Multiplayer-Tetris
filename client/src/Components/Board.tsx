import { BoardShape, BoardType } from './Types';
import Cell from './Cells';

// Props represents current state of a board
interface Props {
    currentBoard : BoardShape;
    boardClass : BoardType;
}

// Mapped board by horizontal lines, each having cells divided by vertical lines
function Board({ currentBoard, boardClass } : Props) {
    return (
        <div className={`board ${boardClass}`}> 
            {currentBoard.map((row, rowIndex) => (
                <div className="row" key={`${rowIndex}`}> 
                    {row.map((cell, colIndex) => (
                        <Cell key={`${rowIndex}-${colIndex}`} type={cell}/>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Board;




