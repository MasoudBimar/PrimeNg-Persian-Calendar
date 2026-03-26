import { TestBed } from '@angular/core/testing';

import { PersianDatepickerService } from './persian-datepicker.service';

describe('PersianDatepickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersianDatepickerService = TestBed.get(PersianDatepickerService);
    expect(service).toBeTruthy();
  });
});
