import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {
  loggedIn = false;

  constructor(private http: HttpClient) {
    if (localStorage.getItem('access_token')) {
      this.loggedIn = true;
    }
  }

  ngOnInit() {}
}
