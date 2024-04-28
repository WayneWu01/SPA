import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogComponent } from './log.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {Router} from "@angular/router";
import {ShareService} from "../../share.service";

describe('LoginComponent', () => {

  let component: LogComponent;
  let fixture: ComponentFixture<LogComponent>;
  let mockRouter: Partial<jasmine.SpyObj<Router>>;

  // @ts-ignore
  let mockSharedService: jasmine.SpyObj<ShareService>;
  const mockUsers = [
    { username: 'Bret', address: { street: 'Kulas Light' }, company: { catchPhrase: 'Test' } }
  ];
  mockRouter = {
    navigate: jasmine.createSpy('navigate')
  } as any;


  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSharedService = jasmine.createSpyObj('ShareService', ['setUsername']);

    TestBed.configureTestingModule({
      declarations: [LogComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ShareService, useValue: mockSharedService }
      ]
    });

    fixture = TestBed.createComponent(LogComponent);
    component = fixture.componentInstance;
    component.users = mockUsers;

    spyOn(localStorage, 'setItem');
  });

  it('should show error message if username does not exist', () => {
    component.onSubmit();

    expect(component.errorMessage[0]).toBe('Invalid username');
    expect(component.showMessage).toBeTrue();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login only json users', async () => {
    const result = await component.login('Bret', 'Kulas Light');

  });

  it('should be success', async () => {
    await component.login('Bret', 'Kulas Light');
    expect(component.status).toBe('success');
  });

  it('should not login an invalid user', async () => {
    const result = await component.login('user', 'pass');

  });

  it('should be error', async () => {
    await component.login('user', 'pass');
    expect(component.status).toBe('error');
  });
  it('should navigate to registration page', () => {
    component.register();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['registration']);
  });

});
