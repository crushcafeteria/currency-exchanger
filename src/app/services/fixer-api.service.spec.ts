import { TestBed } from '@angular/core/testing';

import { FixerAPIService } from './fixer-api.service';

describe('FixerAPIService', () => {
  let service: FixerAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixerAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
