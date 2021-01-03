import { TestBed } from '@angular/core/testing';

import { TreegridService } from './treegrid.service';

describe('TreegridService', () => {
  let service: TreegridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreegridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
