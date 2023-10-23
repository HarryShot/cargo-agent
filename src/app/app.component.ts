import {Component, OnInit} from '@angular/core';
import {PositionInterface} from "./position.interface";
import {GoodsInterface} from "./goods.interface";
import {checkPosition, generatePseudoRandomNumber} from "./helpers";
import {StoreSizeInterface} from "./store-size.interface";
import {Service} from "./service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private service: Service) {
  }

  cellSize: number = 60;
  gapSize: number = 9;

  gridPlaceholder = new Array(100);

  goodsTypes: string[] = [
    "Shirt",
    "Jeans",
    "Shoes",
    "Hat",
    "Socks",
    "Gloves",
    "Dress",
    "Shorts",
    "Skirt",
    "Jacket",
    "Sweater",
    "Boots",
    "Sunglasses",
    "Belt",
    "Scarf",
    "Watch",
    "Umbrella",
    "Bag",
    "Tie",
    "Earrings",
    "Bracelet",
    "Ring",
    "Slippers",
    "Sandals",
    "Pants",
    "Blouse",
    "T-shirt",
    "Coat",
    "Backpack",
    "Wallet",
    "Briefcase",
    "Necklace",
    "Flip-flops",
    "Headphones",
    "Sweatshirt",
    "Pajamas",
    "Vest",
    "Trousers",
    "Cap",
    "Glasses",
    "Tank top",
    "Tote bag",
    "Beanie",
    "Hoodie",
    "Laptop bag",
    "Sneakers",
    "Heels",
    "Slip-on shoes",
    "Boat shoes",
    "Polo shirt",
    "Tunic",
    "Tights",
    "Swimsuit",
    "Bow tie",
    "Trench coat",
    "Parka",
    "Peacoat",
    "Blazer",
    "Chinos",
    "Moccasins",
    "Cardigan",
    "Kimono",
    "Raincoat",
    "Windbreaker",
    "Anorak",
    "Bikini",
    "Crewneck",
    "Beanie",
    "Leggings",
    "Poncho",
    "Hiking boots",
    "Hiking shoes",
    "Baseball cap",
    "Sweatpants",
    "Basketball shorts",
    "Ski jacket",
    "Snow boots",
    "Flannel shirt",
    "Satchel",
    "Clutch",
    "Messenger bag",
    "Tennis shoes",
    "Loafers",
    "Oxfords",
    "Chukka boots",
    "Espadrilles",
    "High-tops",
    "Mules",
    "Platform sandals",
    "Slingback pumps",
    "Peep-toe heels",
    "Penny loafers",
    "Rain boots",
    "Hiking shorts",
    "Cargo pants",
    "Work gloves",
    "Visor",
    "Sun hat",
    "Sunscreen",
    "Insect repellent",
    "Camping tent",
    "Sleeping bag",
    "Hiking socks",
    "Fleece jacket",
    "Beanie hat",
    "Crew socks",
    "Sweatband",
    "Sports bra",
    "Sweat shorts",
    "Yoga pants",
    "Running shoes",
    "Gym bag",
    "Water bottle",
    "Resistance bands",
    "Jump rope",
  ];
  usedGoods: string[] = [];
  availableGoods = [...this.goodsTypes];
  availablePositions: PositionInterface[] = [];

  storeSize: StoreSizeInterface = {
    width: 10,
    height: 10,
  }
  storeGrid: GoodsInterface[][] = Array.from(Array(this.storeSize.width), () => new Array(this.storeSize.height));

  ngOnInit() {
    this.availableGoods = [...this.goodsTypes];
    for(let i = 0; i<=10; i++){
      const goodsType = this.availableGoods[generatePseudoRandomNumber(0, this.availableGoods.length - 1)]
      this.addGoods(
        goodsType,
        generatePseudoRandomNumber(4, 12),
        this.generatePosition(),
      )
      this.manageGoods(goodsType);
    }

    const interval = setInterval(() => {
     console.log(`Purchase`)
      if(this.availablePositions.length === 99){
        clearInterval(interval)
      } else {
        this.imitateGoodsPurchase(interval);
      }
     }, 800);
    this.availablePositions = this.findAvailablePositions();
  }

  findAvailablePositions(){
    const posArr: PositionInterface[] = [];
    for(let i = 0; i < this.storeGrid.length; i++){
      for(let j = 0; j< this.storeGrid[i].length; j++){
        if(!this.storeGrid[i][j] && !!(i||j)) {
          posArr.push({
            x: i,
            y: j,
          })
        }
      }
    }
    return posArr;
  }

  manageGoods(goodsType: string, returnItem?: boolean){
    if(!returnItem) {
      this.usedGoods.push(goodsType);
    } else {
      this.usedGoods = this.usedGoods.filter(item => item !== goodsType);
    }
    this.availableGoods = this.goodsTypes.filter(item => !this.usedGoods.includes(item));
  }

  placeGood(event: GoodsInterface & PositionInterface){
    const pos = {
      x: event.x,
      y: event.y
    }
    this.addGoods(event.name, event.quantity, pos)
    this.manageGoods(event.name)
  }

  generatePosition(): PositionInterface{
    const randPosition = {
      x: generatePseudoRandomNumber(0, this.storeSize.width - 1),
      y: generatePseudoRandomNumber(0, this.storeSize.height - 1),
    }
    if((!randPosition.x && !randPosition.y) || !checkPosition(this.storeGrid, randPosition)){
      return this.generatePosition();
    }
    return  randPosition;
  }

  imitateGoodsPurchase(interval: any){
    const posArr: PositionInterface[] = [];
    for(let i = 0; i < this.storeGrid.length; i++){
      for(let j = 0; j< this.storeGrid[i].length; j++){
        if(this.storeGrid[i][j]) {
          posArr.push({
            x: i,
            y: j,
          })
        }
      }
    }
    if (posArr.length) {
      const randPosition = posArr[generatePseudoRandomNumber(0, posArr.length-1)];
      const punchedQuantity = generatePseudoRandomNumber(1, this.storeGrid[randPosition.x][randPosition.y].quantity);
      if(this.storeGrid[randPosition.x][randPosition.y].quantity - punchedQuantity <=0){
        this.manageGoods(this.storeGrid[randPosition.x][randPosition.y].name, true);
        delete this.storeGrid[randPosition.x][randPosition.y];
        this.service.subject.next({...randPosition});
      } else {
        this.storeGrid[randPosition.x][randPosition.y].quantity = this.storeGrid[randPosition.x][randPosition.y].quantity - punchedQuantity;
      }
    } else {
      if(interval){
        clearInterval(interval)
      }
    }
  }

  addGoods(name: string, quantity: number, position: PositionInterface) {
    if (position.x >= 0 && position.x < this.storeSize.width && position.y >= 0 && position.y < this.storeSize.height) {
      this.storeGrid[position.y][position.x] = { name, quantity };
    } else {
      console.log('Invalid position for adding goods.');
    }
  }
}
