
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { RoomDataService } from './room-data';

describe('RoomDataService', () => {
  let service: RoomDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(RoomDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
