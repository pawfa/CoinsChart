import { Injectable } from '@angular/core';
import {ApiService} from './api.service';

@Injectable()
export class DataService {

  constructor(private apiService: ApiService) { }

  getData(currName: string) {
    return this.apiService.getData(currName);
  }
}
