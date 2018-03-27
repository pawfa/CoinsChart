import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';


import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { StockListComponent } from './stock-list/stock-list.component';
import {ApiService} from './service/api.service';
import {DataService} from './service/data.service';
import {HttpClientModule} from '@angular/common/http';
import {ChartModule} from 'angular2-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    StockListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule.forRoot(require('highcharts/highstock'))
  ],
  providers: [
    ApiService,
    DataService
  ],
  bootstrap: [AppComponent],
  // for removing intellij alert ng: 'chart' is not a known element
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
