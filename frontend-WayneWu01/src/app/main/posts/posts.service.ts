import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, forkJoin, of} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  user?: User;
  timestamp: string;
  avatar: string;
  comments:  Comment[];
  img: string
}
interface Comment {
  name: string;
  reply: string;
  img: string;
}
interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
interface UserAvatar {
  user: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private comm = ['Great', 'Perfect', 'Love the content!', 'I want to go there as well']
  private readonly url = 'https://jsonplaceholder.typicode.com/posts';
  private readonly url2 = 'https://jsonplaceholder.typicode.com/users';
  private readonly urls = [
    "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
    "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_3x2.jpg",
    "https://www.nylabone.com/-/media/project/oneweb/nylabone/images/dog101/activities-fun/10-great-small-dog-breeds/maltese-portrait.jpg",
    "https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-469196054-e1691415831480.jpg?w=1024",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8D-G0b8ka5kyWMioBDY98SOJCYt8Xy7kklA&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5ElLfEoTtQIyOm38WiEMesfB6mUaP8Dl6g&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAFlPslQmWTFp1Of8-4-gxOnkQzqlbPuOciw&usqp=CAU",
    "https://www.cnet.com/a/img/resize/e35a48123c960e24a3f19d884f717a4f178f8485/hub/2022/10/10/c1c115f1-e42a-4c7c-a856-243130d29671/labradorretriever.jpg?auto=webp&fit=crop&height=675&width=1200",
    "https://images.foxtv.com/static.fox5dc.com/www.fox5dc.com/content/uploads/2023/08/932/524/dog-getty.jpg?ve=1&tl=1",
    "https://www.hartz.com/wp-content/uploads/2023/06/why-is-my-dog-sleeping-so-much-1.jpg"
  ];
  constructor(private http: HttpClient) { }
  randomComment(): string {
    const randomIndex = Math.floor(Math.random() * this.comm.length);
    return this.comm[randomIndex];
  }

  randomUserExcept(users: User[], excludedUserId: number): UserAvatar {
    const otherUsers = users.filter(user => user.id !== excludedUserId);
    const rand = Math.floor(Math.random() * otherUsers.length);
    const randomU = otherUsers[rand].username;
    const avatar = this.urls[otherUsers[rand].id - 1] || this.urls[0];

    return {
      user: randomU,
      avatar: avatar
    };
  }
  private createRandomComments(users: User[], userId: number, count: number): Comment[] {
    const comments: Comment[] = [];

    for (let i = 0; i < count; i++) {
      const randComment = this.randomUserExcept(users, userId);
      comments.push({
        name: randComment.user,
        reply: this.randomComment(),
        img: randComment.avatar,
      });
    }

    return comments;
  }
  randomDate(): string {
    const ma = 2000;
    const mi = 2023;
    const year = Math.floor(Math.random() * (ma - mi + 1) + mi);
    const month = Math.floor(Math.random() * (12) + 1);
    const day = Math.floor(Math.random() * (28) + 1);
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  getPostsAndUsers(): Observable<Post[]> {
    return forkJoin({
      posts: this.http.get<Post[]>(this.url),
      users: this.http.get<User[]>(this.url2)
    }).pipe(
      map(({posts, users}) => {
        let pos = 0;
        const userAvatarMap: {[userId: number]: string} = {};
        posts.forEach(post => {
          post.user = users.find(user => user.id === post.userId);
          post.timestamp = this.randomDate();
          if (!userAvatarMap[post.userId]) {
            userAvatarMap[post.userId] = this.urls[pos % this.urls.length];
            pos++;
          }
          post.avatar = userAvatarMap[post.userId];
          post.comments = this.createRandomComments(users, post.userId, 3);
          post.img = "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
        });

        return posts;
      })
    );
  }
  getArticles() {
    return this.http.get('https://ricebookserver222-71c2f6758032.herokuapp.com/articles', {withCredentials: true});
  }
  putA(postId: string, text: string) {
    return this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/articles/' + postId, {text: text}, {withCredentials: true});
  }
  putArticles(postId: string, text: string, commentId: number) {
    return this.http.put('https://ricebookserver222-71c2f6758032.herokuapp.com/articles/' + postId, {text: text, commentId: commentId}, {withCredentials: true});
  }

}
