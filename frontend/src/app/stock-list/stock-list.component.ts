import { Component, OnInit } from '@angular/core';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {

  coins = [];
  coinsSelected :Array<string> = [];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getCoins().subscribe(
      (data: string[]) => {this.coins = data['Data']; console.log(data['Data']);}
    )
  }

  setSelected(target) {


    if(target.checked){
      this.coinsSelected.push(target.name);
    }else{
      const index: number = this.coinsSelected.indexOf(target.name);
      if (index !== -1) {
        this.coinsSelected.splice(index, 1);
      }
    }
    console.log(this.coinsSelected);
  }
}
