import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class ApiService {

  private server = 'http://localhost:3000/';
  private headers: HttpHeaders;
  private apiHistoricalData = 'https://min-api.cryptocompare.com/data/histoday?fsym=';


  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  getData(currName: string) {
    const params = new HttpParams().set('name', currName);
    return this.http.get(this.server + 'api/currencies/', {headers: this.headers, params: params});
  }

  getCoins(){
    return this.http.get(this.server + 'api/currencies/', {headers: this.headers});
  }


  getSelectedCoin(selectedCoin: string){
    return this.http.get(this.apiHistoricalData + selectedCoin+'&tsym=USD&limit=100', {headers: this.headers});
  }
}
