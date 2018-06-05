import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {


  private coinsSelected: Array<{}> = [];
  private socket;
  private coinsSelection;
  private coins = {
    coinsSelected: []
  };
  private form;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      coinsSelected: this.buildSkills()
    });

    this.socket = dataService.getSocket();
    this.coinsSelection = this.dataService.getCoinsSelection();
  }


  ngOnInit() {
    ['coinsList', 'changeCoinArray'].forEach(e => this.socket.on(e,
      data => {
        this.coins.coinsSelected = data.msg;
        this.form = this.fb.group({
          coinsSelected: this.buildSkills()
        });
      }));
  }

  get getCoins(): FormArray {
    return this.form.get('coinsSelected') as FormArray;
  };


  buildSkills() {
    const arr = this.coins.coinsSelected.map(coinsSelected => {
      return this.fb.control(coinsSelected.selected);
    });

    return this.fb.array(arr);
  }

  setSelected(target) {
    let arr = this.coins.coinsSelected;
    if (target.checked) {
      this.coinsSelection.next([target.name, true]);
      arr.filter((e) => e.name === target.name).map((e) => e.selected = true);
    } else {
      this.coinsSelection.next([target.name, false]);
      arr.filter((e) => e.name === target.name).map((e) => e.selected = false);
    }

    this.socket.emit('changeCoinArray', {
      msg: this.coins.coinsSelected
    });

  }


}
