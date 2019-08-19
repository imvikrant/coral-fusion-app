import { Component, OnInit } from '@angular/core';
import { DataService } from './../data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-wrapper',
  templateUrl: './home-wrapper.component.html',
  styleUrls: ['./home-wrapper.component.scss']
})
export class HomeWrapperComponent implements OnInit {
  constructor(public data: DataService, private http: HttpClient) {}

  ngOnInit() {}
}
