import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../../share.service';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  public errorMessage: string[] = [];
  public showMessage: boolean = false;
  users: any[] = [];
  status: string = '';
  loginError: string = '';

  constructor(private router: Router, private sharedService: ShareService, private http: HttpClient) {}

  ngOnInit() {
  }

  onSubmit() {
    this.errorMessage = [];

    const username = document.getElementById('username');
    const password = document.getElementById('password');
    if ((<HTMLInputElement>username).value === '') {
      this.errorMessage.push('empty username');
      this.showMessage = true;
      return;
    }
    if ((<HTMLInputElement>password).value === '') {
      this.errorMessage.push('empty password');
      this.showMessage = true;
      return;
    }
    if ((<HTMLInputElement>username).checkValidity() === true && (<HTMLInputElement>password).checkValidity() === true) {
      this.login((<HTMLInputElement>username).value, (<HTMLInputElement>password).value);
    }

  }


  register() {
    this.router.navigate(['registration']);
  }
  isRegistered(uname: string, password: string): Promise<boolean> {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(users => {
        const foundUser = users.find((user: any) => user.username === uname && user.address.street === password);
        if (foundUser) {
          return true;
        } else {
          return false;
        }
      });
  }
  login(uname: string, password: string){
    return this.http.post('https://ricebookserver222-71c2f6758032.herokuapp.com/login', {username: uname, password: password}, {withCredentials: true})
        .subscribe(
          (res: any) => {
            if (res['result'] === 'success') {
              this.status = 'success';
              localStorage.setItem('username', uname);
              this.router.navigate(['main']);
            }
          },
          err => {
            this.loginError = 'Login failed. Please check your username and password.';
            this.status = 'error';
          },
        );
  }

  fbLogin() {
    document.location.href = 'https://ricebookserver222-71c2f6758032.herokuapp.com/facebook/login';
  }
}
