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

  chart;
  options;
  name = "BTC";
  socket: SocketIOClient.Socket;
  currencies =  new Map<string, number>();
  numberOfLines = 0;

  constructor(private dataService: DataService) {
    this.socket = io.connect('http://localhost:3001');
  }

  ngOnInit() {
    this.options = {
      chart: { type: 'spline' },
      title : { text : 'simple chart' },
      xAxis: {
        type: 'datetime',
      },
    };

    this.socket.on('allCoinData', (data: any) => {
      for(let i = 0; i < data.names.length; i++){
        this.addSeries(data.names[i],data.msg[i] )
      }

    });
    this.socket.on('oneCoinData', (data: any) => {
      this.addSeries(data.name, data.msg[0]);
    });
    this.socket.on('sendingCurrData', (data: any) => {
      // this.processData(data.msg);

    });

  }

  getData() {

    this.currencies.set(this.name,this.numberOfLines++);

    this.socket.emit('addCoin',{
      msg: this.name
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

  addSeries(name,currData){
    console.log(currData['Data']);

    this.chart.addSeries({
      name: name,
      data: (function () {

        let data = [];

        for (let i = 0; i < currData['Data'].length; i++) {
          // console.log(new Date(currData['Data'][i]['time']*1000));
          // console.log(currData['Data'][i]['time']);
          data.push({
            x: currData['Data'][i]['time']*1000,
            y: currData['Data'][i]['open']
          });
        }
        return data;
      }())
    });
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
