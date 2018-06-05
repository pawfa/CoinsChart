import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {ChartEvent} from 'angular2-highcharts/dist/ChartEvent';
import {optionsLong, optionsLive} from './chart.constants.js'
let helperUtil = require('../scripts/ccc.js');


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  private chartLong;
  private chartLive;
  private optionsLong = optionsLong;
  private optionsLive = optionsLive;
  private socket: SocketIOClient.Socket;
  private selectedCoinData = [];
  private coinsList;
  private coinsSelection;


  constructor(private dataService: DataService) {
    this.socket = dataService.getSocket();
  }

  ngOnInit() {

    this.socket.emit('getInitializationData');
    this.coinsSelection = this.dataService.getCoinsSelection();
    this.coinsSelection.subscribe(
      (e) => {
        let index = this.selectedCoinData.indexOf(e[0]);
        e[1]
          ? this.addSeries(this.selectedCoinData[index - 1]['Data'], e[0])
         :
          this.removeSeries(e[0]);

      }
    );

    this.socket.on('coinsList',
      (data) => {
        this.coinsList = data.msg;
        this.selectedCoinData = data.coinsData;
        data.msg.filter( e => e.selected ).forEach( coin => {
          let index = data.coinsData.indexOf(coin.name);
          this.addSeries(data.coinsData[index - 1]['Data'], coin.name);
        });
      }
    );

    this.socket.on('changeCoinArray', data => {
      this.coinsList = data.msg;
      let diff = data.msg.filter( e => {
        return !this.coinsList.some( obj2 => {
          return e.name === obj2.name && e.selected === obj2.selected;
        });
      });

      if (diff != undefined) {
        if (diff[0].selected) {
          let index = this.selectedCoinData.indexOf(diff[0].name);
          this.addSeries(this.selectedCoinData[index - 1]['Data'], diff[0].name);
        } else {
          this.removeSeries(diff[0].name);
        }
      }
    });


    this.socket.on('coinLiveData', data => {
      this.chartLive.series[0].name === data.name
      ?
        this.processData(data.msg)
      :
        this.chartLive.series[0].update({name: data.name, data: []});
    });
  }

  addSeries(coinData, coinName) {

    this.chartLong.addSeries({
      name: coinName,
      data: (function () {
        return coinData.map( (e,i) => {
          return {
            x: (coinData[i]['time']) * 1000,
            y: coinData[i]['open']
          }
        });
      }())
    });
  }

  removeSeries(name) {
    let index = this.chartLong.series.findIndex(e => e.name === name);
    if (index != -1) {
      this.chartLong.series[index].remove(true);
    }
  }


  processData(data) {
    let unpackedData = helperUtil.unpackMessage(data);
    let currency = unpackedData['FROMSYMBOL'];
    let price = unpackedData['PRICE'];
    let flag = unpackedData['FLAGS'];
    this.addPoints(currency, price, flag);
  }

  addPoints(currency, price, flag) {
    if (price != undefined && flag != 4) {
      let x = (new Date()).getTime()+2*60*60*1000;
      this.chartLive.series[0].addPoint([x, price]);
    }
  }

  saveInstanceLong(chartInstance) {
    this.chartLong = chartInstance;
  }

  saveInstanceLive(chartInstance) {
    this.chartLive = chartInstance;
  }

  onSeriesClick(event: ChartEvent) {
    this.socket.emit('getCoinLive', {
      msg: event.context.name
    });
    this.chartLive.series[0].update({data: []});
  }
}
