import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineComponent } from './headline.component';
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('HeadlineComponent', () => {
  let component: HeadlineComponent;
  let fixture: ComponentFixture<HeadlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadlineComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientModule],
      providers: [HttpClient]
    });
    fixture = TestBed.createComponent(HeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update the headline value and set it in local storage', () => {
    component.status = 'New Headline';
    spyOn(localStorage, 'setItem');
    component.updateStatus();
    expect(component.headline).toEqual('New Headline');
    expect(localStorage.setItem).toHaveBeenCalledWith('headline', 'New Headline');
  });
});
