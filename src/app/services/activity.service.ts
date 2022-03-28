import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor( private http:HttpClient) { 
    console.log('Servico activity listo')
   }

   getActivity(dateFrom: string, dateTo: string, resourceId: string):any{

    const username = 'gcba_esb_2@buenosaires2.test';
    const password = 'd298f34800229ef0afe8e36e004cca9c6cea4f88398bcce541ea874c19e1df95';
    const url = 'https://buenosaires2.test.etadirect.com/rest/ofscCore/v1/activities/?dateFrom=' + dateFrom + '&dateTo=' + dateTo + '&resources='+ resourceId +'&fields=resourceId,activityType,latitude,longitude'

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');
    //headers = headers.set('Access-Control-Allow-Origin', '*')
    headers = headers.set('Authorization', 'Basic ' + btoa(`${username}:${password}`))

     return this.http.get(url,{headers : headers} )
   }


}
