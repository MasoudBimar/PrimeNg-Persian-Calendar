import { TestBed } from '@angular/core/testing';

import { PrimengDatepickerService } from './primeng-datepicker.service';

describe('PrimengDatepickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrimengDatepickerService = TestBed.get(PrimengDatepickerService);
    expect(service).toBeTruthy();
  });
});
