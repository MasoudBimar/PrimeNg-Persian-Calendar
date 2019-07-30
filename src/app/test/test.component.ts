import { Component, OnInit } from '@angular/core';
import moment from 'jalali-moment';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  date;
  date2;
  minDate = moment().add(-2, 'days');
  maxDate= moment().add(3, 'days');
  invalidDates = [moment()];
  constructor() {
    this.date = moment().locale('fa');
    this.date2 = moment().locale('en');
    console.log(this.date.format());
    console.log(this.date2.format());
  }

  ngOnInit() {
  }

}
