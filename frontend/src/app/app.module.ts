import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { StockListComponent } from './stock-list/stock-list.component';
import {ApiService} from './service/api.service';
import {DataService} from './service/data.service';
import {HttpClientModule} from '@angular/common/http';
import {ChartModule} from 'angular2-highcharts';


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    StockListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartModule.forRoot(require('highcharts/highstock'))
  ],
  providers: [
    ApiService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
