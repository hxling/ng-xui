import { TestBed } from '@angular/core/testing';

import { DndService } from './dnd.service';

describe('DndService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DndService = TestBed.get(DndService);
    expect(service).toBeTruthy();
  });
});
