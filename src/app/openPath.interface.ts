import {PositionInterface} from "./position.interface";

export interface OpenPathInterface extends PositionInterface{
  g: number;
  h: number;
  parent?: any;
}
