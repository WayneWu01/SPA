import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(private http: HttpClient,private router: Router, private ngZone: NgZone) {}
  addPost: string = '';
  ngOnInit() {}

  logout() {
    this.http.put('http://localhost:3000/logout', {}, {withCredentials: true})
      .subscribe((res:any) => {
        console.log(res);
      });
    localStorage.clear();
    this.router.navigate(['auth']);
  }
  addFollower(event: any) {
    this.addPost = event;
  }
}
