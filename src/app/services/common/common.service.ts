import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  getFirst(arr:any[]):Promise<any>{
    return new Promise((rs,rj) => {
      rs(arr[0])
    })
  }
}
