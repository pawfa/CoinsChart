import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { chart } from 'highcharts';
import * as Highstock from 'highcharts/highstock';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @ViewChild('chartTarget') chartTarget: ElementRef;
  chart: Highstock.ChartObject;
  options = {
    chart: {
      renderTo: 'container',
      type: 'areaspline'
    },
    series: [{
      name: 'Jane',
      data: [1, 0, 4]
    }]
  };
  data = '' ;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.chart = chart(this.chartTarget.nativeElement, this.options);

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

}
