import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

describe('ProfileService', () => {
  let service: ProfileService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule, HttpClientModule, FormsModule]});
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch user by username', () => {
    const mockUsers = [
      { id: 1, username: 'User1' },
      { id: 2, username: 'User2' },
      { id: 3, username: 'User3' }
    ];

    service.getUsername('User2').subscribe(user => {
      expect(user).toEqual(mockUsers[1]);
    });

  });

  it('should fetch user by id', () => {
    const mockUser = { id: 2, username: 'User2' };

    service.getId(2).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

  });
});
