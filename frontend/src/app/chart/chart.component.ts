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
  chart;
  options;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.options = {
      chart: { type: 'spline' },
      title : { text : 'simple chart' },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2,123,123,5356,456,7,79,34,3,45,5678,68],
      }]
    };
    // setInterval(() => this.chart.series[0].addPoint(Math.random() * 10), 1000);

  }

  getData() {
    this.dataService.getData('MSFT').subscribe(
      (data: string) => {
        this.data  = data;
        console.log(data); }
    );
  }

  showData() {
    // for (let i = 0; i < 10; i++){
    //   console.log(this.data['Weekly Time Series'][i]);
    // }
    console.log(this.data['Weekly Time Series']['2000-01-14']);
    console.log();

    const keys = Object.keys(this.data['Weekly Time Series']);
    for (let entry of keys) {
      console.log(entry); // 1, "string", false
    }
  }

  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }
}
