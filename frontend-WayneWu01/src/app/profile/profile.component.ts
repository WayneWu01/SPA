import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';
import { NgForm } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { ShareService } from '../share.service';
import{RegistrationService} from "../auth/registration/registration.service";
import {Router} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  profile: any = {};
  email: string ='';
  phone: string ='';
  zipcode: string ='';
  username: any;
  password: string ='11111';
  iavatar: string ='';
  avatar?: File;
  constructor(private router: Router, private profileService: ProfileService, private sharedService: ShareService,private regi: RegistrationService, private http: HttpClient) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe((res:any) => {
      this.profile = res['profile'];
      this.username = this.profile[0].username;
      this.email = this.profile[0].email;
      this.phone = this.profile[0].phone;
      this.zipcode = this.profile[0].zipcode;
      this.iavatar = this.profile[0].avatar;
    });
  }

  getInfo(): string[] {
    return [this.email, this.phone, this.zipcode, this.password];
  }

  getObscured(): string {
    return this.password.replace(/./g, '•');
  }
  uploadAvatar(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.avatar = <File>event.target.files[0];
      const data = new FormData();
      data.append('image', this.avatar, this.avatar.name);
      this.profileService.uploadAvatar(data).subscribe((res:any) => {
        if (res['img']) {
          this.profileService.updateAvatar(res['img']).subscribe(re => {
            this.profileService.getProfile().subscribe((profile:any) => {
              this.profile = profile['profile'];
            });
          });
        }
      });
    }
  }
  onSubmit() {
    let valid = true;

    // Validation
    if (!(<HTMLInputElement>document.getElementById('accountName')).checkValidity()) {
      (<HTMLInputElement>document.getElementById('checkA')).style.display = 'block';valid = false;
    } else {
      (<HTMLInputElement>document.getElementById('checkA')).style.display = 'none';
    }
    if (!(<HTMLInputElement>document.getElementById('email')).checkValidity()) {
      (<HTMLInputElement>document.getElementById('checkE')).style.display = 'block';valid = false;
    } else {
      (<HTMLInputElement>document.getElementById('checkE')).style.display = 'none';
    }
    if (!(<HTMLInputElement>document.getElementById('phone')).checkValidity()) {
      (<HTMLInputElement>document.getElementById('checkP')).style.display = 'block';valid = false;
    } else {
      (<HTMLInputElement>document.getElementById('checkP')).style.display = 'none';
    }
    if (!(<HTMLInputElement>document.getElementById('zipcode')).checkValidity()) {
      (<HTMLInputElement>document.getElementById('checkZ')).style.display = 'block';valid = false;
    } else {
      (<HTMLInputElement>document.getElementById('checkZ')).style.display = 'none';
    }
    if ((<HTMLInputElement>document.getElementById('password')).value !== '') {
      this.password =  (<HTMLInputElement>document.getElementById('password')).value;
      this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/password', {password: (<HTMLInputElement>document.getElementById('password')).value}, {withCredentials: true})
        .subscribe(err => {
          console.log(err);
        });
    }
    if (valid) {
      if ((<HTMLInputElement>document.getElementById('accountName')).value !== '') {
        (<HTMLInputElement>document.getElementById('Aname')).innerText =  (<HTMLInputElement>document.getElementById('accountName')).value;
      }
      if ((<HTMLInputElement>document.getElementById('email')).value !== '') {
        (<HTMLInputElement>document.getElementById('iemail')).innerText =  (<HTMLInputElement>document.getElementById('email')).value;
        this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/email', {email: (<HTMLInputElement>document.getElementById('email')).value}, {withCredentials: true})
          .subscribe(err => {
            console.log(err);
          });
      }
      if ((<HTMLInputElement>document.getElementById('phone')).value !== '') {
        (<HTMLInputElement>document.getElementById('iphone')).innerText =  (<HTMLInputElement>document.getElementById('phone')).value;
        this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/phone', {tel: (<HTMLInputElement>document.getElementById('phone')).value}, {withCredentials: true})
          .subscribe(err => {
            console.log(err);
          });
      }
      if ((<HTMLInputElement>document.getElementById('zipcode')).value !== '') {
        (<HTMLInputElement>document.getElementById('izip')).innerText =  (<HTMLInputElement>document.getElementById('zipcode')).value;
        this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/zipcode', {zipcode: (<HTMLInputElement>document.getElementById('zipcode')).value}, {withCredentials: true})
          .subscribe(err => {
            console.log(err);
          });
      }
    }
  }
  showLinkSuccess = false;
  showLinkWarning = false;
  showUnlinkMessage = false;

  link() {
    const username = (<HTMLInputElement>document.getElementById('normalUsername')).value;
    const password = (<HTMLInputElement>document.getElementById('normalPassword')).value;
    if (localStorage.getItem('username')) {
      this.showLinkWarning = true;
      return;
    }
    this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/link', {username: username, password: password}, {withCredentials: true})
      .subscribe((res:any) => {
        if (res['message'] === 'Already linked') {
          this.showLinkSuccess = true;
        } else {
          console.log(res);
        }
      });
  }

  unlink() {
    this.http.get('https://ricebookserver222-71c2f6758032.herokuapp.com/unlink', {withCredentials: true}).subscribe((res:any) => {
      console.log(res);
      if (res['result'] === 'success') {
        this.showUnlinkMessage = true;
      }
    });
  }
}
