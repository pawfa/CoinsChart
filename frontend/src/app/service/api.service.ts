import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ApiService {

  private server = 'http://localhost:3000/';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  getData(stockName: string) {

    return this.http.get(this.server + 'api/stock/' + stockName, {headers: this.headers});

  }
}
