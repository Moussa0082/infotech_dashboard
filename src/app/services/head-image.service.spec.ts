import { TestBed } from '@angular/core/testing';

import { HeadImageService } from './head-image.service';

describe('HeadImageService', () => {
  let service: HeadImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
