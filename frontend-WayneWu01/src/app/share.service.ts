import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private storedUsername = sessionStorage.getItem('username') || '';
  private usernameSource = new BehaviorSubject<string>(this.storedUsername);

  currentUsername = this.usernameSource.asObservable();
  private newFollowerAddedSource = new BehaviorSubject<any>(null);
  newFollowerAdded = this.newFollowerAddedSource.asObservable();

  constructor() {}

  setUsername(username: string) {
    this.usernameSource.next(username);
    sessionStorage.setItem('username', username);
  }
}
