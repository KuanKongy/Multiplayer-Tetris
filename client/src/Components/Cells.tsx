import { CellOptions } from "./Types";

// Cell is one of the options of a cell
interface Props {
    type : CellOptions;
}

// Default Cell
function Cell({ type } : Props) {
    return <div className={`cell ${type}`} />;
}

export default Cell;