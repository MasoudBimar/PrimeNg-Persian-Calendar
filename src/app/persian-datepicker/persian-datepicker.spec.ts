import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersianDatepickerComponent } from './primeng-datepicker.component';

describe('PersianDatepickerComponent', () => {
  let component: PersianDatepickerComponent;
  let fixture: ComponentFixture<PersianDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersianDatepickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersianDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
