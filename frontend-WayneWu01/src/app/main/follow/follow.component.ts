import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShareService } from '../../share.service';
import {ProfileService} from "../../profile/profile.service";
import { HttpClient } from '@angular/common/http';
import {FollowService} from './follow.service';
@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit {
  urls = [
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
  curid: any;
  curusername: any;
  followers: any[] = [];
  errorMessage: string = '';
  @Output() newFollowerAdded = new EventEmitter();
  constructor(private fServ: FollowService, private profileService: ProfileService, private sharedService: ShareService, public http: HttpClient ) {}
  ngOnInit() {
    this.fServ.getFollowers().subscribe((data:any) => {
      this.followers = data['profiles'];
    });
  }
  fetchUser(username: string) {
    this.profileService.getUsername(username).subscribe(user => {
      if (user) {
        this.curid = user.id;
        this.getFollowers();
      }
    });
  }
  getFollowers() {
    this.followers = [];
    let followedIds = [
      (this.curid % 10) + 1,
      (this.curid + 1) % 10 + 1,
      (this.curid + 2) % 10 + 1
    ];

    this.profileService.getId(followedIds[0]).subscribe(user1 => {
      this.followers.push({
        username: user1.username,
        headline: user1.company.catchPhrase,
        avatar: this.urls[followedIds[0] - 1],
        id: user1.id
      });
    });

    this.profileService.getId(followedIds[1]).subscribe(user2 => {
      this.followers.push({
        username: user2.username,
        headline: user2.company.catchPhrase,
        avatar: this.urls[followedIds[1] - 1],
        id: user2.id
      });
    });

    this.profileService.getId(followedIds[2]).subscribe(user3 => {
      this.followers.push({
        username: user3.username,
        headline: user3.company.catchPhrase,
        avatar: this.urls[followedIds[2] - 1],
        id: user3.id
      });
    });
  }
  unFollow(name:string) {
    this.http.delete('https://ricebookserver222-71c2f6758032.herokuapp.com/following/' + name, {withCredentials: true})
      .subscribe(res => {
        this.fServ.getFollowers().subscribe((data:any) => {
          this.followers = data['profiles'];
        });

      });

    this.newFollowerAdded.emit(JSON.stringify({'username': name, 'status': 0}));
  }

  addFollower() {

    const inputElement = <HTMLInputElement>document.getElementById('addUserName');
    const inputUsername = inputElement.value.trim();

    if (inputUsername === '') {
      return;
    }

    if (inputUsername === localStorage.getItem('username')) {
      this.errorMessage = 'You cannot follow yourself.';
    } else {
      this.fServ.getFollowingList().subscribe((res:any) => {
        const filteredList = res['following'].filter((el:any) => el === inputUsername);
        if (filteredList.length > 0) {
          this.errorMessage = 'You are already following this user.';
        } else {
          this.http.put(`https://ricebookserver222-71c2f6758032.herokuapp.com/following/${inputUsername}`, {}, {withCredentials: true})
            .subscribe(
              result => {
                this.fServ.getFollowers().subscribe((data:any) => {
                  this.followers = data['profiles'];
                  this.newFollowerAdded.emit(JSON.stringify({'username': inputUsername, 'status': 1}));
                  inputElement.value = '';
                });
              },
              err => {
                this.errorMessage = 'An error occurred';
              }
            );
        }
      });
    }
  }



}
