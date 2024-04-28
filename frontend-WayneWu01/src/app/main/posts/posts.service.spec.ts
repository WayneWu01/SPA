import { TestBed } from '@angular/core/testing';

import { PostsService } from './posts.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule, HttpClientModule, FormsModule]});
    service = TestBed.inject(PostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
