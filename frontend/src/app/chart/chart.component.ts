import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
let helperUtil = require('../scripts/ccc.js');

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  chart;
  options;
  name = "";
  socket: SocketIOClient.Socket;
  selectedCoinData: Observable<{}>;

  constructor(private dataService: DataService) {
    this.socket = dataService.getSocket();
  }

  ngOnInit() {
    this.options = {
      chart: { type: 'spline' },
      title : { text : 'simple chart' },
      xAxis: {
        type: 'datetime',
      },
    };
    this.socket.emit('getInitializationData');

    this.selectedCoinData = this.dataService.getSelectedCoinData();
    this.socket.on('allCoinData', (data: any) => {
      this.dataService.getSelectedCoinName().next(data.names);
      for(let i = 0; i < data.names.length; i++){
        this.addSeries(data.msg[i],data.names[i])
      }
    });

    this.selectedCoinData.subscribe(
      (coinData) => this.addSeries(coinData['data'],coinData['selectedCoin'])
    );

    this.socket.on('addedCoin', (data: any) => {
      this.dataService.getSelectedCoinName().next([data.msg]);
      this.dataService.getSelectedCoin(data.msg).subscribe();
    });

    this.socket.on('removedCoin', (data: any) => {
      this.dataService.getSelectedCoinName().next([data.msg]);
    });

  }

  addSeries(currData,name){

    this.chart.addSeries({
      name: name,
      data: (function () {

        let data = [];

        for (let i = 0; i < currData['Data'].length; i++) {
          data.push({
            x: currData['Data'][i]['time']*1000,
            y: currData['Data'][i]['open']
          });
        }
        return data;
      }())
    });


  }



  processData(data){
    let unpackedData = helperUtil.unpackMessage(data);
    let currency = unpackedData['FROMSYMBOL'];
    let price = unpackedData['PRICE'];
    let flag = unpackedData['FLAGS'];
    console.log(unpackedData);
    if(flag != 4){
      this.addPoints(currency, price);
    }

  }

  addPoints(currency,price) {
    let x = (new Date()).getTime();
    console.log(price);

    for (let i = 0; i < this.chart.series.length-1;i++ ){

      if(this.chart.series[i]['name'] === currency){
        price = price || this.chart.series[i].processedYData[this.chart.series[i].processedYData.length - 1];
        this.chart.series[i].addPoint([x,price],false,false);
      }else{
        this.chart.series[i].addPoint([x,this.chart.series[i].processedYData[this.chart.series[i].processedYData.length - 1]],false,false)
      }
    }
    this.chart.redraw();
  }

  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }
}
