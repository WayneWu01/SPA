import { Component, OnInit, NgZone } from '@angular/core';
import { ShareService } from '../../share.service';
import { ProfileService } from '../../profile/profile.service';
import { RegistrationService } from '../../auth/registration/registration.service';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-headline',
  templateUrl: './headline.component.html',
  styleUrls: ['./headline.component.css']
})
export class HeadlineComponent implements OnInit {
  user: any;
  username: any;
  headline: string = '';
  status: string = '';
  loginUser: any;

  constructor(
    private profileService: ProfileService,
    private sharedService: ShareService,
    private regi: RegistrationService,
    private ngZone: NgZone,
    private http: HttpClient
  ) {
    this.username = localStorage.getItem('username');
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe((data:any) => {
      this.loginUser = data['profile'];
    });
  }


  updateStatus() {
    this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/headline', {headline: this.status}, {withCredentials: true})
      .subscribe(err => {
        console.log(err);
      });
    const headlineElement = document.getElementById('headline');
    if (headlineElement) {
      headlineElement.innerHTML = this.status;
    }

    this.status = '';
  }
}
