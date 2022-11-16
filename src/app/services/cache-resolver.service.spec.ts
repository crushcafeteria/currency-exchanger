import { TestBed } from '@angular/core/testing';

import { CacheResolverService } from './cache-resolver.service';

describe('CacheResolverService', () => {
  let service: CacheResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
