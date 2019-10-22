import { TestBed } from '@angular/core/testing';

import { TreegridService } from './treegrid.service';

describe('TreegridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TreegridService = TestBed.get(TreegridService);
    expect(service).toBeTruthy();
  });
});
