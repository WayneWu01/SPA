import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private username: string ='';

  constructor() { }

  setUsername(username: string) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }
}
