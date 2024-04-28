import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from './registration.service'
import { ShareService } from '../../share.service';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  constructor(private router: Router,  private sharedService: ShareService, private http: HttpClient) { }
  public errorMessage: string[] = [];
  public showMessage: boolean = false;
  public errorM: string[] = [];
  public showM: boolean = false;
  ngOnInit() {
  }
  onSubmit() {
    let valid = true;
    this.errorMessage = [];
    this.showMessage = false;
    // Account Name
    const accountName = <HTMLInputElement>document.getElementById('AName');
    if (!accountName.checkValidity() || !(/^[a-zA-Z][a-zA-Z0-9]*$/.test(accountName.value))) {
      valid = false;
      if (accountName.value === '') {
        this.errorMessage.push('Please enter your Account Name');
      } else {
        this.errorMessage.push('Only starts with uppercase or lowercase letters; Letters and numbers are allowed.');
      }
    }

    // Email Address
    const email = <HTMLInputElement>document.getElementById('EAddress');
    if (!email.checkValidity()) {
      valid = false;
      if (email.value === '') {
        this.errorMessage.push('Please enter your Email Address');
      } else {
        this.errorMessage.push('Please check your Email address');
      }
    }

    // Phone Number
    const phone = <HTMLInputElement>document.getElementById('Phone');
    if (!phone.checkValidity()) {
      valid = false;
      if (phone.value === '') {
        this.errorMessage.push('Please enter your Phone Number');
      } else {
        this.errorMessage.push('Format for phone: 123-123-1234');
      }
    }

    // Birth Date
    const birthday = <HTMLInputElement>document.getElementById('birthday');
    if (!birthday.checkValidity()) {
      valid = false;
      if (birthday.value === '') {
        this.errorMessage.push('Please enter your Birth Date');
      } else {
        this.errorMessage.push('Please check your birthday date');
      }
    }

    // Zip Code
    const zip = <HTMLInputElement>document.getElementById('Zip');
    if (!zip.checkValidity()) {
      valid = false;
      if (zip.value === '') {
        this.errorMessage.push('Please enter your ZipCode');
      } else {
        this.errorMessage.push('Zipcode must contain 5 digits');
      }
    }

    // Password and Confirm Password
    const pass = <HTMLInputElement>document.getElementById('Pass');
    const confirm = <HTMLInputElement>document.getElementById('PassC');
    if (!pass.checkValidity()) {
      valid = false;
      this.errorMessage.push('Please enter your Password');
    }
    if (!confirm.checkValidity()) {
      valid = false;
      this.errorMessage.push('Please confirm your Password');
    }
    if (pass.value !== confirm.value) {
      valid = false;
      this.errorMessage.push('The password and confirmation password do not match.');
    }

    // Age
    const today = new Date();
    const birth = new Date(birthday.value);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    const day = today.getDate() - birth.getDate();
    if (month < 0 || (month === 0 && day < 0)) {
      age = age - 1;
    }
    if (age < 18) {
      valid = false;
      this.errorMessage.push('You must be at least 18 years old.');
    }
    if (this.errorMessage.length > 0) {
      this.showMessage = true;
    }
    if (valid) {
      const data = {
        'username': accountName.value,
        'password': pass.value,
        'email': email.value,
        'phone': phone.value,
        'dob': birthday.value,
        'zipcode': zip.value
      };

      const loginData = {
        'username': accountName.value,
        'password': pass.value
      };
      console.log(accountName);
      console.log(data);
      this.http.post('https://ricebookserver222-71c2f6758032.herokuapp.com/register', data, { withCredentials: true }).subscribe((res: any) => {
        if (res['result'] === 'success') {
          console.log(res);
          this.http.post('https://ricebookserver222-71c2f6758032.herokuapp.com/login', loginData, {withCredentials: true}).subscribe((res: any) => {
            this.router.navigate(['main']);
          });

        }
        if (res['result'] === 'registered') {
          this.errorM.push('Already registered');
          this.showM = true;
        }
      });
    }
  }

  reset() {
    const form = document.getElementById('Form') as HTMLFormElement;
    form.reset();
  }
}
