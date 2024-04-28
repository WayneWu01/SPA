import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostsComponent } from './posts.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {PostsService} from "./posts.service";
import {ShareService} from "../../share.service";
import {of} from "rxjs";

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostsComponent],
      imports: [HttpClientTestingModule, HttpClientModule, FormsModule],
      providers: [PostsService, ShareService]
    });
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.posts = [{
      userId: 1,
      id: 101,
      title: "Sample Post Title",
      body: "This is a sample post body.",
      timestamp: "2023-10-20",
      avatar: "https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg",
      comments: [
        {
          name: "S1",
          reply: "Great",
          img: "https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg"
        },
        {
          name: "S2",
          reply: "Good",
          img: "https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg"
        }
      ],
      user: {
        id: 1,
        name: "S",
        username: "sss",
        email: "s@s.com",
        address: {
          street: "123",
          suite: "123",
          city: "Sample",
          zipcode: "12345",
          geo: {
            lat: "123",
            lng: "123"
          }
        },
        phone: "123-456-7890",
        website: "123",
        company: {
          name: "123",
          catchPhrase: "123",
          bs: "123"
        }
      }
    },{
      userId: 1,
      id: 101,
      title: "Sample Post Title",
      body: "This is a sample post body22222.",
      timestamp: "2023-10-20",
      avatar: "https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg",
      comments: [
        {
          name: "S1",
          reply: "Great",
          img: "https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg"
        },
        {
          name: "S2",
          reply: "Good",
          img: "https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg"
        }
      ],
      user: {
        id: 1,
        name: "S",
        username: "ss",
        email: "s@s.com",
        address: {
          street: "123",
          suite: "123",
          city: "Sample",
          zipcode: "12345",
          geo: {
            lat: "123",
            lng: "123"
          }
        },
        phone: "123-456-7890",
        website: "123",
        company: {
          name: "123",
          catchPhrase: "123",
          bs: "123"
        }
      }
    }];
    component.initialPosts = [...component.posts];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch articles for current logged in user', fakeAsync(() => {
    localStorage.setItem('username', 'sample');
    component.ngOnInit();
    expect(component.posts.length).toBe(2);
  }));

  it('should fetch subset of articles with given search keyword', () => {
    expect(component.search('body22222')).toBe(1);
    expect(component.search('ss')).toBe(1);
  });
  it('should add articles when adding a follower', () => {
    const mock = {
      status: 1,
      username: 'sss',
      id: 3
    };
    component.addNewPosts = JSON.stringify(mock);
    expect(component.posts.length).toBe(3);
  });

  it('should remove articles when removing a follower', () => {
    const mock = {
      status: 0,
      username: 'sss',
      id: 1
    };
    component.addNewPosts = JSON.stringify(mock);
    expect(component.posts.length).toBe(0);
  });
  it('should update keyword', () => {
    const returnedKeyword = component.update('sample');
    expect(component.keyword).toBe('sample');
    expect(returnedKeyword).toBe('sample');
  });
  it('should clear the input value', () => {
    const inputElement = document.createElement('input');
    inputElement.id = 'newPost';
    inputElement.value = 'Test';
    document.body.appendChild(inputElement);
    component.clear();
    const updatedValue = (<HTMLInputElement>document.getElementById('newPost')).value;
    expect(updatedValue).toBe('');
    document.body.removeChild(inputElement);
  });
  it('should add a new post', () => {
    const inputElement = document.createElement('input');
    inputElement.id = 'newPost';
    inputElement.value = 'New test post';
    document.body.appendChild(inputElement);
    const initialPostsLength = component.posts.length;
    component.postNew();
    expect(component.posts.length).toBe(initialPostsLength + 1);
    document.body.removeChild(inputElement);
  });
});
