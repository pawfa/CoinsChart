import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {ChartEvent} from 'angular2-highcharts/dist/ChartEvent';

let helperUtil = require('../scripts/ccc.js');

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  chartLong;
  chartLive;
  optionsLong;
  optionsLive;
  name = '';
  socket: SocketIOClient.Socket;
  selectedCoinData = [];
  coinsList;
  coinsSelection;
  positiveValue = 1;
  negativeValue = -1;

  constructor(private dataService: DataService) {
    this.socket = dataService.getSocket();
  }

  ngOnInit() {
    this.optionsLong = {
      chart: {type: 'spline'},
      rangeSelector: {
        selected: 4
      },
      title: {text: 'Historical Coin Price Data'},
      plotOptions: {
        series: {
          cursor: 'pointer',
          showInNavigator: true

        }
      },
      xAxis: {
        type: 'datetime',
      },
      lang: {noData: "No data to display"}
    };

    this.optionsLive = {
      chart: {type: 'spline'},
      title: {text: 'simple chart'},

      xAxis: {
        type: 'linear',
      },
      series: [{
        data: [0]
      }],
      lang: {noData: "No data to display"}
    };

    this.socket.emit('getInitializationData');
    this.coinsSelection = this.dataService.getCoinsSelection();
    this.coinsSelection.subscribe(
      (e) => {
        let index = this.selectedCoinData.indexOf(e[0]);
        if (e[1]) {
          this.addSeries(this.selectedCoinData[index - 1]['Data'], e[0]);
        } else {
          this.removeSeries(e[0]);
        }
      }
    );

    this.socket.on('coinsList',
      (data) => {
        this.coinsList = data.msg;
        this.selectedCoinData = data.coinsData;
        let trueArr = data.msg.filter((e) => e.selected === true);
        for (let coin of trueArr) {
          let index = data.coinsData.indexOf(coin.name);
          this.addSeries(data.coinsData[index - 1]['Data'], coin.name);
        }
      }
    );

    this.socket.on('changeCoinArray', (data: any) => {
      let coins = this.coinsList;
      let diff = data.msg.filter(function (e) {
        return !coins.some(function (obj2) {
          return e.name === obj2.name && e.selected === obj2.selected;
        });
      });

      this.coinsList = data.msg;
      if (diff != undefined) {
        if (diff[0].selected) {
          let index = this.selectedCoinData.indexOf(diff[0].name);
          this.addSeries(this.selectedCoinData[index - 1]['Data'], diff[0].name);
        } else {
          this.removeSeries(diff[0].name);
        }
      }
    });


    this.socket.on('coinLiveData', (data)=>{
      if(this.chartLive.series[0].name === data.name){
        console.log(data);
        this.processData(data.msg)
      }else{
        this.chartLive.series[0].update({name: data.name, data: [0]});
      }

    })
  }

  addSeries(coinData, coinName) {

    this.chartLong.addSeries({
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
    console.log(unpackedData);
    // if (flag != 4) {
      this.addPoints(currency, price,flag);
    // }
  }

  addPoints(currency, price,flag) {
    if(price != undefined){
    if(flag == 1){
      this.chartLive.series[0].addPoint([this.positiveValue++, price]);
    }else if(flag == 2){
      this.chartLive.series[0].addPoint([this.negativeValue--, price]);
    }

    }


  }

  saveInstanceLong(chartInstance) {
    this.chartLong = chartInstance;
  }
  saveInstanceLive(chartInstance) {
    this.chartLive = chartInstance;
  }

  onSeriesClick(event: ChartEvent) {

    this.socket.emit('getCoinLive',{
      msg: event.context.name
    });
    this.chartLive.series[0].update({name: event.context.name, data: [0]});
    // this.chartLive.series[0].setData({
    //   data: []
    // });
    // this.chartLive.series[0].addPoint([1522344589138,7499.08305917 ], true, true);
    // this.chartLive.series[0].addPoint([1,1 ], true, true);

  }
}
