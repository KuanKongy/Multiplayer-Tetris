import { useState, useCallback } from "react";
import { Block } from "../Components/Types";

export function useBag() {
  const [sevenBlocks, setSevenBlocks] = useState<Block[]>([]);
  
  const refillBag = useCallback(() => {
    const blocks: Block[] = Object.values(Block);
    const shuffledBag = shuffleArray(blocks);
    setSevenBlocks(shuffledBag);
  }, []);

  const getNextBlock = useCallback(() => {
    if (sevenBlocks.length === 0) {
        refillBag();
    }
    const newSevenBlocks = structuredClone(sevenBlocks) as Block[];
    let newBlock = newSevenBlocks.pop() as Block;
    setSevenBlocks(newSevenBlocks);
    return newBlock;
  }, []);

  return [sevenBlocks, setSevenBlocks, getNextBlock];
};

function shuffleArray(array: Block[]): Block[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}