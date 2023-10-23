import {AfterViewInit, Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {GoodsInterface} from "../goods.interface";
import {PositionInterface} from "../position.interface";
import {checkIsValidPosition, checkPosition, generatePseudoRandomNumber} from "../helpers";
import {OpenPathInterface} from "../openPath.interface";
import {StoreSizeInterface} from "../store-size.interface";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {Service} from "../service";

@Component({
  selector: 'app-cargo-agent',
  templateUrl: './cargo-agent.component.html',
  styleUrls: ['./cargo-agent.component.scss']
})
export class CargoAgentComponent implements AfterViewInit, OnInit {

  @Input()
  set availableGoods(val: string[]){
    this._availableGoods = val;
  }
  _availableGoods: string[] = [];

  @Input()
  storeGrid: GoodsInterface[][] = [];
  @Input()
  availableSlots: PositionInterface[] = [];

  @Input()
  storeSize: StoreSizeInterface | undefined;

  @Input()
  cellSize: number = 0;

  @Input()
  gapSize: number = 0;

  @Output()
  addGood: EventEmitter<GoodsInterface & PositionInterface> = new EventEmitter<GoodsInterface & PositionInterface>();

  path: PositionInterface[] = [];
  initialPos: PositionInterface = {
    x: 0,
    y: 0,
  }
  currentPosition: PositionInterface = this.initialPos;



  @HostBinding('style')
  get myStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`left: ${this.currentPosition.x * this.cellSize + this.gapSize}px; top: ${this.currentPosition.y * this.cellSize + this.gapSize}px`);
  }

  constructor(private sanitizer:DomSanitizer, private service: Service) {}

  ngAfterViewInit() {
    this.findEndPosition();
  }

  ngOnInit() {
    this.service.getSubject().subscribe((data: PositionInterface | undefined) => {
      if (data){
        if(this.availableSlots.findIndex(item => item.x === data.x && item.y === data.y) === -1){
          this.availableSlots.push(data);
        }
      }
    })
  }

  findEndPosition() {
    const length = this.availableSlots.length;
    if(!!length) {
    const pos = this.availableSlots[generatePseudoRandomNumber(0, length)];
      this.setEndPosition(pos);
    }
  }

  manageAvailableList(pos: PositionInterface) {
    const index = this.availableSlots.findIndex((item) => item.x === pos.x && item.y === pos.y);
    if (index > -1) {
      this.availableSlots.splice(index, 1);
    }
  }
  setEndPosition(position: PositionInterface) {
    // A* algorithm to find the path from the current position to (x, y)
    this.path = this.findPath(position);
    console.log(`go to`, position)
    console.log(`path length`, this.path.length)
    if(!this.path.length) {
      this.manageAvailableList(position);
      this.findEndPosition();
    } else {
      this.fillStore();
    }
  }

  fillStore() {
    this.path.forEach((position, step) => {
     setTimeout(() => {
        this.currentPosition = position;
        if (step + 1 >= this.path.length){
          const goodPosition = this.path[this.path.length - 1];
          const newGoodsName = this._availableGoods[generatePseudoRandomNumber(0, this._availableGoods.length - 1)];
          const quantity = generatePseudoRandomNumber(4,12);
          this.manageAvailableList(goodPosition);
          this.addGood.emit({
            name: newGoodsName,
            quantity: quantity,
            ...goodPosition
          });
          this.currentPosition = {...this.initialPos};
          this.findEndPosition();
        }
      }, step * 180);
    });
  }

  findPath(endPosition: PositionInterface) {
    const openList: OpenPathInterface[] = [{ x: 0, y: 0, g: 0, h: 0 }];
    const closedList = [];
    const directions = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
    ];


    while (openList.length > 0) {
      openList.sort((a, b) => a.g + a.h - (b.g + b.h));
      const currentNode = openList.shift();
      closedList.push(currentNode);

      if (currentNode && (currentNode.x === endPosition.x && currentNode.y === endPosition.y)) {
        // Path found, reconstruct the path
        let path: PositionInterface[] = [];
        let current = currentNode;
        while (current) {
          path.push({ x: current.x, y: current.y });
          current = current.parent;
        }
        return path.reverse();
      }

      for (const direction of directions) {
        const neighborX = currentNode!.x + direction.x;
        const neighborY = currentNode!.y + direction.y;
        const neighborG = currentNode!.g + 1;
        const neighborH = Math.abs(neighborX - endPosition.x) + Math.abs(neighborY - endPosition.y);

        if (
          checkPosition(this.storeGrid, {x: neighborX, y: neighborY}) &&
          checkIsValidPosition({x: neighborX, y: neighborY}, this.storeSize!) &&
          !closedList.find((node) => node!.x === neighborX && node!.y === neighborY)
        ) {
          const openIndex = openList.findIndex(
            (node) => node.x === neighborX && node.y === neighborY
          );
          if (openIndex === -1) {
            openList.push({
              x: neighborX,
              y: neighborY,
              g: neighborG,
              h: neighborH,
              parent: currentNode,
            });
          } else if (neighborG < openList[openIndex].g) {
            openList[openIndex] = {
              x: neighborX,
              y: neighborY,
              g: neighborG,
              h: neighborH,
              parent: currentNode,
            };
          }
        }
      }
    }

    // If no path found, return an empty array
    return [];
  }

}
