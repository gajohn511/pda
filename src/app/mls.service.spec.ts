import { TestBed, inject } from '@angular/core/testing';

import { MlsService } from './mls.service';

describe('MlsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MlsService]
    });
  });

  it('should be created', inject([MlsService], (service: MlsService) => {
    expect(service).toBeTruthy();
  }));
});
