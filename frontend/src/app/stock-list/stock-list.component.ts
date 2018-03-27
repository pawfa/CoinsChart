import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {Subject} from 'rxjs/Subject';
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
  selectedCoinNameSubject: Subject<string[]>;


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
        console.log(this.coins.coinsSelected[0]);
        for(let currency of data){
          let index = this.coins.coinsSelected.findIndex(function(e){
            return e.name == currency
          });
          if(index != -1){
            this.coins.coinsSelected[index]['selected'] = !this.coins.coinsSelected[index]['selected'];
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
      this.coinsSelected.push(target.name);
      this.dataService.getSelectedCoin(target.name);

      this.socket.emit('addCoin', {
        msg: target.name
      });
    } else {
      const index: number = this.coinsSelected.indexOf(target.name);
      if (index !== -1) {
        this.coinsSelected.splice(index, 1);
      }
      this.socket.emit('removeCoin', {
        msg: target.name
      });
    }
  }


}
