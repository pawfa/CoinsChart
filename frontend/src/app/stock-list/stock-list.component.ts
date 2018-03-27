import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {


  coinsSelected: Array<{}> = [];
  coins = {
    coinsSelected: []
  };
  socket;
  form;
  selectedCoinNameSubject;


  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      coinsSelected: this.buildSkills()
    });

    this.socket = dataService.getSocket();
    this.selectedCoinNameSubject = this.dataService.getSelectedCoinName();
  }


  ngOnInit() {

    this.dataService.getCoins().subscribe(
      (data: string[]) => {
        let i = 0;
        data['Data'].forEach(data => {
          let obj = {
            name: '',
            selected: false,
            id :0
          };
          obj.name = data['SYMBOL'];
          obj.selected = false;
          obj.id = i++;
          this.coins.coinsSelected.push(obj);
        });
        this.form = this.fb.group({
          coinsSelected: this.buildSkills()
        });
      }
    );

    this.selectedCoinNameSubject.asObservable().subscribe(
      (data) => {
        for(let currency of data[0]){
          let index = this.coins.coinsSelected.findIndex(function(e){
            return e.name == currency
          });
          if(index != -1 ){
            if(this.coins.coinsSelected[index]['selected'] != data[1]) {
              this.coins.coinsSelected[index]['selected'] = data[1];
            }
          }
        }
        this.form = this.fb.group({
          coinsSelected: this.buildSkills()
        });

      }
    );

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
    if (target.checked) {
      // this.selectedCoinNameSubject.next([[target.name], true]);
      this.dataService.getSelectedCoin(target.name);
      this.socket.emit('addCoin', {
        msg: target.name
      });

    } else {
      // this.selectedCoinNameSubject.next([[target.name], false]);
      this.socket.emit('removeCoin', {
        msg: target.name
      });
    }
  }


}
