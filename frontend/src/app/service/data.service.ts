import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import * as io from "socket.io-client";
import {Subject} from 'rxjs/Subject';

@Injectable()
export class DataService {
  socket: SocketIOClient.Socket;

  coinsSelection = new Subject();

  constructor(private apiService: ApiService) {
    // this.socket = io.connect('http://back_charts.pawfa.usermd.net:3001');
    this.socket = io.connect('http://localhost:3001/');
  }

  getSocket(){
    return this.socket;
  }

  getCoinsSelection(){
    return this.coinsSelection;
  }
}
