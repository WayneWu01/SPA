import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import {LogComponent} from "./log/log.component";
import {RouterModule} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent, LogComponent],
      imports: [RouterModule, RouterTestingModule, HttpClientModule],
      providers: [HttpClient]
    });
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
