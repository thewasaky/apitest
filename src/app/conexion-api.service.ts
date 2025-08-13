import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class ConexionApiService {
  //url="http://localhost:80/apiProceso/";
  constructor(private http:HttpClient) { }

  petGET(url: string, headers?: any) {
    return this.http.get(url, headers ? { headers } : {});
  }

  petPOST(url: string, body: any, headers?: any) {
    let opts: any = {};
    if (body instanceof FormData) {
      opts.headers = headers || {};
      return this.http.post(url, body, opts);
    } else {
      opts.headers = { 'Content-Type': 'application/json', ...headers };
      return this.http.post(url, JSON.stringify(body), opts);
    }
  }

  petDELETE(url: string, headers?: any) {
    return this.http.delete(url, headers ? { headers } : {});
  }

  petPUT(url: string, body: any, headers?: any) {
    let opts: any = {};
    if (body instanceof FormData) {
      opts.headers = headers || {};
      return this.http.put(url, body, opts);
    } else {
      opts.headers = { 'Content-Type': 'application/json', ...headers };
      return this.http.put(url, JSON.stringify(body), opts);
    }
  }

}
