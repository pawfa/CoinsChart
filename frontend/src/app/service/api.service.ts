import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class ApiService {

  private server = 'http://localhost:3000/';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  getData(stockName: string) {
    const params = new HttpParams().set('name', stockName);

    return this.http.get(this.server + 'api/stock/', {headers: this.headers, params: params});

  }
}
