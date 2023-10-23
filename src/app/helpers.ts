import {GoodsInterface} from "./goods.interface";
import {PositionInterface} from "./position.interface";
import {StoreSizeInterface} from "./store-size.interface";

export const checkPosition = (grid: GoodsInterface[][], position: PositionInterface) => {
  if(checkIsValidPosition(position, {
    width: grid.length,
    height: grid[0].length
  })) {
    return !grid[position.y][position.x];
  }
  return false;
};
export const checkIsValidPosition = (position: PositionInterface, storeSize: StoreSizeInterface) => position.x >= 0 && position.x < storeSize.width && position.y >= 0 && position.y < storeSize.height;

export const generatePseudoRandomNumber = (min: number, max: number) =>  Math.floor(Math.random() * (max - min) + min);
