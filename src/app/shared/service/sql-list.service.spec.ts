import { TestBed } from '@angular/core/testing';

import { SqlListService } from './sql-list.service';

describe('SqlListService', () => {
  beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

  it('should be created', () => {
    const service: SqlListService = TestBed.get(SqlListService);
    expect(service).toBeTruthy();
  });
});
