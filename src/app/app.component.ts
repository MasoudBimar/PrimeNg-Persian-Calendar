import { Component, OnInit } from '@angular/core';
//
import moment from 'jalali-moment';

import 'moment/locale/fa';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {}
  ngOnInit(): void {}
}
