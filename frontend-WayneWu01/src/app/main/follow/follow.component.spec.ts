import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowComponent } from './follow.component';
import { ShareService } from '../../share.service';
import { ProfileService } from '../../profile/profile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {of} from "rxjs";

describe('FollowComponent', () => {
  let component: FollowComponent;
  let fixture: ComponentFixture<FollowComponent>;
  let shareService: ShareService;
  let profileService: ProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowComponent],
      imports: [HttpClientTestingModule],
      providers: [ShareService, ProfileService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowComponent);
    component = fixture.componentInstance;
    shareService = TestBed.inject(ShareService);
    profileService = TestBed.inject(ProfileService);
    profileService = TestBed.inject(ProfileService);
    profileService.getUsername = jasmine.createSpy('getUsername spy').and.returnValue(of({ id: 1 }));

    // Mocking the getId method to return sample users
    profileService.getId = jasmine.createSpy('getId spy').and.returnValue(of({
      username: 'mockUser',
      company: {
        catchPhrase: 'mockHeadline'
      },
      id: 1
    }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user on init', () => {
    spyOn(component, 'fetchUser');
    component.ngOnInit();
    expect(component.fetchUser).toHaveBeenCalled();
  });

  it('should fetch followers when user is fetched', () => {

    const initialFollowersCount = component.followers.length;
    const username = 'mockUsername';

    component.fetchUser(username);

    expect(component.followers.length).toBe(3);

  });
  it('should remove follower when unFollow is called', () => {
    component.followers = [
      { username: 'user1', headline: 'headline1', avatar: 'url1', id: 1 },
      { username: 'user2', headline: 'headline2', avatar: 'url2', id: 2 }
    ];
    component.unFollow('user1');
    expect(component.followers).toEqual([{ username: 'user2', headline: 'headline2', avatar: 'url2', id: 2 }]);
  });

  it('should add follower when addFollower is called with a valid user', () => {
    spyOn(component.http, 'get').and.returnValue(of([
      {
        username: 'newUser',
        company: { catchPhrase: 'newHeadline' },
        id: 3
      }
    ]));
    spyOn(document, 'getElementById').and.callFake(() => {
      return { value: 'newUser' } as HTMLInputElement;
    });
    component.addFollower();
    const newUser = {
      username: 'newUser',
      headline: 'newHeadline',
      avatar: component.urls[2],
      id: 3
    };
    expect(component.followers).toContain(newUser);
  });

});
