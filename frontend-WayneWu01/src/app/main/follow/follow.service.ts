import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http: HttpClient) { }

  getFollowingList() {
    return this.http.get('https://ricebookserver222-71c2f6758032.herokuapp.com/following/', {withCredentials: true});
  }

  getFollowers() {
    return this.http.get('https://ricebookserver222-71c2f6758032.herokuapp.com/followingProfile', {withCredentials: true});
  }
}
