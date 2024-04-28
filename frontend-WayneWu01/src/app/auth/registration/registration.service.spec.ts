import { TestBed } from '@angular/core/testing';

import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the username', () => {
      service.setUsername('JohnDoe');
      expect(service.getUsername()).toBe('JohnDoe');
  });



  it('should get the username', () => {
      service.setUsername('JaneDoe');
      const result = service.getUsername();
      expect(result).toBe('JaneDoe');
  });

});
