import { TestBed } from '@angular/core/testing';

import { DomService } from './dom.service';

describe('DomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DomService = TestBed.get(DomService);
    expect(service).toBeTruthy();
  });
});
