import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import {FollowComponent} from './follow/follow.component';
import {HeadlineComponent} from './headline/headline.component';
import {PostsComponent} from './posts/posts.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClient, HttpClientModule} from '@angular/common/http';
describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent, FollowComponent, HeadlineComponent, PostsComponent ],
      imports: [RouterModule, FormsModule, RouterTestingModule, HttpClientModule],
      providers: [HttpClient]
    });
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out a user', function () {
    component.logout();
    expect(localStorage.length).toEqual(0);
  });
  it('should update addPost on addFollower', () => {
    const testEvent = 'TestEvent';

    component.addFollower(testEvent);

    expect(component.addPost).toBe(testEvent);
  });
});
