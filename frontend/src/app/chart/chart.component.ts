import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  // @ViewChild('chartTarget') chartTarget: ElementRef;
  data = '' ;
  chartData = [];
  chart;
  options;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getData();
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
    this.dataService.getData('MSFT').subscribe(
      (data: string) => {
        this.data  = data;
        this.showData(); }
    );
  }

  showData() {
    const keys = Object.keys(this.data['Time Series (Daily)']);
    console.log(this.data['Time Series (Daily)']);
    for (let i = 0; i < 10; i++) {
      this.chartData[i] = [Date.parse(keys[i]), parseInt(this.data['Time Series (Daily)'][keys[i]]['1. open'])];
    }
    console.log(this.chartData);
    this.chartData.sort(function(a, b) {
        return a[0] - b[0];
      }
    );
    console.log(this.chartData);
    this.chart.addSeries({
      name: 'MSFT',
      data: this.chartData
    });

    this.chart.redraw();

    // for (let entry of keys) {
    //
    //   this.chart.series[0].addPoint(entry, false);
    // }
    // this.chart.series.data = this.data['Weekly Time Series'];

  }

  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }
}
