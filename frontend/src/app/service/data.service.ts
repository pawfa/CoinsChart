import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import * as io from "socket.io-client";
import {Subject} from 'rxjs/Subject';

@Injectable()
export class DataService {
  socket: SocketIOClient.Socket;

  selectedCoinData = new Subject<{}>();
  selectedCoinName = new Subject();

  constructor(private apiService: ApiService) {
    // this.socket = io.connect('http://back_charts.pawfa.usermd.net:3001');
    this.socket = io.connect('http://localhost:3001/');
  }

  getData(currName: string) {
    return this.apiService.getData(currName);
  }

  getCoins(){
    return this.apiService.getCoins();
  }

  getSocket(){
    return this.socket;
  }

  getSelectedCoin(selectedCoin){
       this.apiService.getSelectedCoin(selectedCoin).subscribe(
        (data: JSON) => {this.selectedCoinData.next({data, selectedCoin})}
      );
    return this.selectedCoinData;
  }

  getSelectedCoinData(){
    return this.selectedCoinData.asObservable();
  }
  getSelectedCoinName(){
    return this.selectedCoinName;
  }
}
