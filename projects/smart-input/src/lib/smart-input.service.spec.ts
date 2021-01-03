import { TestBed } from '@angular/core/testing';

import { SmartInputService } from './smart-input.service';

describe('SmartInputService', () => {
  let service: SmartInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
