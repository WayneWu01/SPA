import { TestBed } from '@angular/core/testing';

import { ShareService } from './share.service';

describe('ShareService', () => {
  let service: ShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should update session storage when setUsername is called', () => {
    const testUsername = 'User';
    service.setUsername(testUsername);

    expect(sessionStorage.getItem('username')).toBe(testUsername);
  });
});
