import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import {Router, RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ProfileService} from "./profile.service";
import {LogComponent} from '../auth/log/log.component';
import {FormsModule} from "@angular/forms";
import { of } from 'rxjs';
import {ShareService} from "../share.service";
describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let sharedService: { currentUsername: jasmine.SpyObj<any> };
  beforeEach(() => {
    profileService = jasmine.createSpyObj('ProfileService', ['getUsername']);
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent, LogComponent],
      imports: [RouterModule, RouterTestingModule, HttpClientModule, FormsModule],
      providers: [HttpClient]
    });
    sharedService = jasmine.createSpyObj('ShareService', ['setUsername']);
    sharedService.currentUsername = of('test');

    TestBed.configureTestingModule({
      declarations: [ProfileComponent, LogComponent],
      imports: [RouterModule, RouterTestingModule, HttpClientModule, FormsModule],
      providers: [
        { provide: ProfileService, useValue: profileService },
        { provide: ShareService, useValue: sharedService }
      ]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get login user profile information', async () => {
    const mockUser =  {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      },
    };

    component.username = 'Bret';

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const infoArray = component.getInfo();

      expect(infoArray[0]).toEqual('Sincere@april.biz');
      expect(infoArray[1]).toEqual('1-770-736-8031 x56442');
      expect(infoArray[2]).toEqual('92998-3874');
      expect(infoArray[3]).toEqual('Kulas Light');
    });
    profileService.getUsername.and.returnValue(of(mockUser));
    component.ngOnInit();
  });
  it('should update the displayed user data when valid data is entered', () => {
    // Arrange
    document.getElementById = jasmine.createSpy('HTML Element').and.callFake((id) => {
      const dummyElements: { [key: string]: any } = {
        accountName: { value: 'JohnDoe', checkValidity: () => true },
        email: { value: 'john@example.com', checkValidity: () => true },
        phone: { value: '1234567890', checkValidity: () => true },
        zipcode: { value: '12345', checkValidity: () => true },
        password: { value: 'secret' },
        Aname: { innerText: '' },
        iemail: { innerText: '' },
        iphone: { innerText: '' },
        izip: { innerText: '' },
        checkA: { style: { display: '' } },
        checkE: { style: { display: '' } },
        checkP: { style: { display: '' } },
        checkZ: { style: { display: '' } }
      };
      return dummyElements[id] || null;
    });

    component.onSubmit();

    const accountNameDisplay = (<any>document.getElementById('Aname')).innerText;
    const emailDisplay = (<any>document.getElementById('iemail')).innerText;
    const phoneDisplay = (<any>document.getElementById('iphone')).innerText;
    const zipDisplay = (<any>document.getElementById('izip')).innerText;

    expect(accountNameDisplay).toBe('');
    expect(emailDisplay).toBe('');
    expect(phoneDisplay).toBe('');
    expect(zipDisplay).toBe('');
  });
  it('getInfo should return an array of class properties', () => {
    component.email = 'test';
    component.phone = '123';
    component.zipcode = '12345';
    component.password = 'Test';

    const result = component.getInfo();

    expect(result).toEqual([
      'test',
      '123',
      '12345',
      'Test'
    ]);
  });
  it('should initialize with user details on ngOnInit', fakeAsync(() => {
    const mockUsername = 'test';
    const mockUser = {
      email: 'test',
      phone: '123',
      address: {
        zipcode: '12345',
        street: 'Test'
      }
    };

    sharedService.currentUsername = of('test');
    profileService.getUsername.and.returnValue(of(mockUser));
    component.ngOnInit();
    tick();

    expect(component.email).toBe(mockUser.email);
    expect(component.phone).toBe(mockUser.phone);
    expect(component.zipcode).toBe(mockUser.address.zipcode);
    expect(component.password).toBe(mockUser.address.street);
  }));
});
