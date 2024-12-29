import { Block, SHAPES } from '../Types';

import { StyledTitle, StyledWrapper } from './NextTetromino.styles';

interface Props {
    holdBlocks: Block[];
}

function HoldBlocks({ holdBlocks }: Props) {
    return (
        <StyledWrapper>
        <StyledTitle>Hold</StyledTitle>
        <div className="hold">
            {holdBlocks.map((block, blockIndex) => {
                const shape = SHAPES[block].shape.filter((row) =>
                    row.some((cell) => cell)
                );
                return (
                    <div key={blockIndex}>
                        {shape.map((row, rowIndex) => {
                            return (
                                <div key={rowIndex} className="row">
                                    {row.map((isSet, cellIndex) => { const cellClass = isSet ? block : 'hidden';
                                        return (
                                            <div key={`${blockIndex}-${rowIndex}-${cellIndex}`} className={`cell ${cellClass}`}></div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
        </StyledWrapper>
    );
}

export default HoldBlocks;