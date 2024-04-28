import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { Router } from '@angular/router';
import { ShareService } from '../../share.service';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let getElementByIdSpy: jasmine.Spy;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSharedService: jasmine.SpyObj<ShareService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSharedService = jasmine.createSpyObj('ShareService', ['setUsername']);

    TestBed.configureTestingModule({
      declarations: [RegistrationComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ShareService, useValue: mockSharedService }
      ]
    }).compileComponents();
    getElementByIdSpy = spyOn(document, 'getElementById');
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
  });
  afterEach(() => {
    getElementByIdSpy.and.callThrough();
  });
  it('should create the registration component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to main if the form is valid', () => {
    getElementByIdSpy.and.callFake(id => {
      const defaultMockElement: Partial<HTMLInputElement> = {
        value: '',
        checkValidity: () => true
      };

      switch(id) {
        case 'AName':
          const mockElementAName: Partial<HTMLInputElement> = {
            value: 'ValidName',
            checkValidity: () => true
          };
          return mockElementAName as any;

        case 'birthday':
          const mockElementBirthday: Partial<HTMLInputElement> = {
            value: '2000-01-01',
            checkValidity: () => true
          };
          return mockElementBirthday as any;

        default: return defaultMockElement as any;
      }
    });

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['main']);
    expect(mockSharedService.setUsername).toHaveBeenCalled();
  });

  it('should not navigate if the form is invalid', () => {
    getElementByIdSpy.and.callFake(id => {
      switch(id) {
        case 'AName':
          return {
            value: 'InvalidName1',
            checkValidity: () => false
          } as any;
        case 'birthday':
          return {
            value: '2006-01-01',
            checkValidity: () => true
          } as any;

        default:
          return {
            value: '',
            checkValidity: () => false
          } as any;
      }
    });
    component.onSubmit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.errorMessage).toContain('Only starts with uppercase or lowercase letters; Letters and numbers are allowed.');
    expect(component.errorMessage).toContain('You must be at least 18 years old.');

    expect(component.showMessage).toBe(true);
  });


  it('should reset the form when reset is called', () => {
    const mockForm = { reset: jasmine.createSpy() };
    getElementByIdSpy.and.returnValue(mockForm as any);

    component.reset();

    expect(mockForm.reset).toHaveBeenCalled();
  });


});
