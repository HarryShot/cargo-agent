import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-goods-item',
  templateUrl: './goods-item.component.html',
  styleUrls: ['./goods-item.component.scss']
})
export class GoodsItemComponent {
  @Input()
  name: string | undefined;

  @Input()
  quantity: number | undefined;
}
