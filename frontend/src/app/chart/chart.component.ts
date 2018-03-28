import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
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
  selectedCoinData =[];
  coinsList;
  coinsSelection;

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
    this.coinsSelection = this.dataService.getCoinsSelection();
    this.coinsSelection.subscribe(
      (e) => {
        let index = this.selectedCoinData.indexOf(e[0]);
        if(e[1]){
          this.addSeries(this.selectedCoinData[index-1]['Data'],e[0]);
        }else{
          this.removeSeries(e[0]);
        }
      }
    );

    this.socket.on('coinsList',

      (data) => {
      console.log(data);
        this.coinsList = data.msg;
        this.selectedCoinData = data.coinsData;
        let trueArr = data.msg.filter((e) => e.selected === true);
        for (let coin of trueArr){
          let index = data.coinsData.indexOf(coin.name);
          this.addSeries(data.coinsData[index-1]['Data'],coin.name);
        }
      }
    );

    this.socket.on('changeCoinArray', (data: any) => {
      let coins = this.coinsList;
      let diff = data.msg.filter(function(e){
        return !coins.some(function(obj2) {
          return e.name === obj2.name && e.selected === obj2.selected;
        });
      });
      console.log(diff);
      this.coinsList = data.msg;
      if (diff != undefined) {
        if (diff[0].selected) {
          let index = this.selectedCoinData.indexOf(diff[0].name);
          this.addSeries(this.selectedCoinData[index - 1]['Data'], diff[0].name);
        } else {
          this.removeSeries(diff[0].name)
        }
      }
      // for (let coin of diff){
      //   console.log(coin.name);
      //   let index = data.coinsData.indexOf(coin.name);
      //
      // }
    });
  }

  addSeries(coinData, coinName){

        this.chart.addSeries({
          name: coinName,
          data: (function () {

            let data = [];

            for (let i = 0; i < coinData.length; i++) {
              data.push({
                x: coinData[i]['time'] * 1000,
                y: coinData[i]['open']
              });
            }
            return data;
          }())
        });
    }

  removeSeries(name){

      let index = this.chart.series.findIndex( e => e.name === name);
      if(index != -1){
        this.chart.series[index].remove(true);
      }
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
