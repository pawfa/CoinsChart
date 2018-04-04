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

  private chartLong;
  private chartLive;
  private optionsLong;
  private optionsLive;
  private socket: SocketIOClient.Socket;
  private selectedCoinData = [];
  private coinsList;
  private coinsSelection;


  constructor(private dataService: DataService) {
    this.socket = dataService.getSocket();
  }

  ngOnInit() {
    this.optionsLong = {
      chart: {type: 'spline'},
      title: {
        text: 'Historical Coin Price Data'
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          showInNavigator: true
        }
      },
      rangeSelector: {
        allButtonsEnabled: true,
        verticalAlign: 'bottom',
        buttons: [{
          type: 'week',
          count: 1,
          text: 'Week',
          dataGrouping: {
            forced: true,
            units: [['day', [1]]]
          }
        },
          {
          type: 'month',
          count: 1,
          text: 'Month',
          dataGrouping: {
            forced: true,
            units: [['day', [1]]]
          }
        },
          {
            type: 'month',
            count: 3,
            text: '3 Months',
            dataGrouping: {
              forced: true,
              units: [['day', [1]]]
            }
          },
          {
            type: 'all',
            text: 'ALL',
            dataGrouping: {
              forced: true,
              units: [['day', [1]]]
            }
          }],
        buttonTheme: {
          width: 60
        },
        inputEnabled: false
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis:{
        offset: 20
      },
      lang: {noData: 'No data to display'}
    };

    this.optionsLive = {
      chart: {type: 'spline'},
      title: {text: 'Coin price change'},

      xAxis: {
        type: 'datetime',
      },
      series: [{
        name: 'Price change',
        data: [],
        color: '#c9f1fd'
      }],
      yAxis: {
        title: {
          enabled: true,
          text: 'Percentage change',
          style: {
            fontWeight: 'normal'
          },
        },
        opposite: true,
        plotLines: [{
          value: 0,
          width: 3,
          color: 'silver'
        }],
        labels: {
          formatter: function () {
            return (this.value > 0 ? '+' : '') + this.value + '%';
          }
        },
        align: 'right',
        x: 5
      },
      lang: {noData: 'Click on a coin series to see live trade. <br/>' +
        ' Be patient it can take a while'},
      plotOptions: {
        series: {
          compare: 'percent'
        },
      },
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
        console.log(data);
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


    this.socket.on('coinLiveData', (data) => {
      if (this.chartLive.series[0].name === data.name) {
        this.processData(data.msg);
      } else {
        this.chartLive.series[0].update({name: data.name, data: []});
      }

    });
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
    this.addPoints(currency, price, flag);

  }

  addPoints(currency, price, flag) {
    console.log(this.chartLive.series);
    if (price != undefined) {

      let x = (new Date()).getTime();
      console.log(x);
      if (flag != 4) {
        this.chartLive.series[0].addPoint([x, price]);
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

    this.socket.emit('getCoinLive', {
      msg: event.context.name
    });
    this.chartLive.series[0].update({data: []});
  }
}
