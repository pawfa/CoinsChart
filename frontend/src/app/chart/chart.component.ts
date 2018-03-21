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

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.chart = chart(this.chartTarget.nativeElement, this.options);

  }

  getData(){
    console.log('odpalamy');
    this.dataService.getData('MSFT').subscribe(
      (data) => console.log(data)
    );
  }

}
