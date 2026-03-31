import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'jalali-moment';
import { PersianDatepickerComponent } from '../persian-datepicker/persian-datepicker';

@Component({
  selector: 'app-test',
  templateUrl: './test.html',
  styleUrls: ['./test.css'],
  imports: [
    PersianDatepickerComponent,
    FormsModule
  ]
})
export class TestComponent {

  isJalali = false;
  date;
  date2 = new Date();
  minDate = moment().add(-2, 'days');
  maxDate = moment().add(3, 'days');
  invalidDates = [new Date()];
  constructor() {
    this.date = moment().locale('fa');
    // this.date2 = moment().locale('en');
    console.log(this.date.format());
  }

}
