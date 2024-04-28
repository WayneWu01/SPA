import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  url = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }
  getUsername(username: string) {
    return this.http.get<any[]>(this.url).pipe(
      map((users: any[]) => users.find(user => user.username === username))
    );
  }
  getId(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
  getProfile() {
    return this.http.get('https://ricebookserver222-71c2f6758032.herokuapp.com/profile', {withCredentials: true});
  }

  uploadAvatar(data: FormData) {
    return this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/uploadAvatar', data, {withCredentials: true});
  }

  updateAvatar(avatar: string) {
    return this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/avatar', {avatar: avatar}, {withCredentials: true});
  }
}
