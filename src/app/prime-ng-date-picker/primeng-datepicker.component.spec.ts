import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengDatepickerComponent } from './primeng-datepicker.component';

describe('TbcoPrimengDatepickerComponent', () => {
  let component: PrimengDatepickerComponent;
  let fixture: ComponentFixture<PrimengDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrimengDatepickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimengDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
