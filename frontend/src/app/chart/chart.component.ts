import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import * as io from 'socket.io-client';
let helperUtil = require('../scripts/ccc.js');

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  chartData = [];
  chart;
  options;
  name = 'MSFT';
  socket: SocketIOClient.Socket;
  stockNames : Set<JSON>;

  constructor(private dataService: DataService) {
    this.socket = io.connect('http://localhost:3001');
  }

  ngOnInit() {

    this.socket.emit('getStockData', {
      name: this.name
    });
    this.socket.on('sendingStockData', (data: any) => {
      this.showData(data.msg);
    });

    this.options = {
      chart: { type: 'spline' },
      rangeSelector: {
        selected: 1
      },
      title : { text : 'simple chart' },
      xAxis: {
        type: 'datetime',
      },
    };

  }

  getData() {
    this.socket.emit('getStockData', {
      name: this.name
    });
    // this.dataService.getData(this.name).subscribe(
    //   (data: string) => {
    //     this.showData(data); }
    // );
  }

  showData(data) {
    // let res = CCC.CURRENT.unpack(data);
    let res = helperUtil.unpackMessage(data);
    console.log(res);
    console.log(res['FROMSYMBOL']);
    // console.log(res['PRICE']);

  // console.log(data);
  //   data.forEach((json, index) => {

    // console.log(json);


    //   const keys = Object.keys(json['Time Series (Daily)']);
    //
    //   for (let i = 0; i < keys.length; i++) {
    //     this.chartData[i] = [Date.parse(keys[i]), parseInt(json['Time Series (Daily)'][keys[i]]['1. open'])];
    //   }
    //   this.chartData.sort(function (a, b) {
    //       return a[0] - b[0];
    //     }
    //   );
    //
    //   // console.log(this.chartData);
    //   this.chart.addSeries({
    //     name: json["Meta Data"]["2. Symbol"],
    //     data: this.chartData
    //   });
    //
    //   this.chart.redraw();
    // });


  }

  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }


  addNew() {
    // this.dataService.getData('AMZN').subscribe(
    //   (data: string) => {
    //     this.data  = data;
    //     this.showData(); }
    // );
  }
}
