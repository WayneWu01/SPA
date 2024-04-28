import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from './posts.service';
import { Post } from './posts.service';
import { ShareService } from '../../share.service';
import {HttpClient} from '@angular/common/http';
import {ProfileService} from '../../profile/profile.service';
declare var $: any;

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  username: any;
  initialPosts: any;
  keyword: string ='';
  img?: File;
  url: string ='';

  constructor(
    private postServ: PostsService,
    private sharedService: ShareService,
    private http: HttpClient,
    private profileService: ProfileService
  ) {
    this.username = localStorage.getItem('username');
  }

  @Input()
  set addNewPosts(addPost: string) {
    if (addPost !== null && addPost !== '') {
      // console.log('addPosts:' + addPost);
      const res = JSON.parse(addPost);
      // console.log(res);
      if (res.status === 1) {
        this.http.get('https://ricebookserver222-71c2f6758032.herokuapp.com/articles', {withCredentials: true})
          .subscribe( (data:any) => {
            this.posts = data['articles'].sort(this.sortPost);
          });
      } else {
        this.posts = this.posts.filter((it:any) => it.author !== res.username);
      }
    }
  }

  sortPost(a: any, b: any): number {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  }

  ngOnInit() {
    this.postServ.getArticles().subscribe( (res:any) => {
      this.posts = res['articles'].sort(this.sortPost);
    });

  }

  update(keyword: string) {
    this.keyword = keyword;
    this.search(this.keyword);
    return this.keyword;
  }
  uploadImage(event:any) {
    if (event.target.files && event.target.files[0]) {
      this.img = <File>event.target.files[0];
      const data = new FormData();
      data.append('image', this.img, this.img.name);
      this.profileService.uploadAvatar(data).subscribe((res: any) => {
        if (res['img']) {
          this.url = res['img'];
        } else {
          this.url = '';
        }
      });
    }
  }
  search(keyword: string) {
    this.posts = this.posts.filter(post => post.username.indexOf(keyword) >= 0 || post.text.indexOf(keyword) >= 0);
    return this.posts.length;
  }
  clear() {
    (<HTMLInputElement>document.getElementById('newPost')).value = '';
  }

  postNew() {
    const article = (<HTMLInputElement>document.getElementById('newPost')).value;
    this.http.post('https://ricebookserver222-71c2f6758032.herokuapp.com/article', {image: this.url, text: article}, {withCredentials: true})
      .subscribe((res:any) => {
        this.posts.splice(0, 0, res['articles'][0]);
        this.clear();
      });
  }

  updatePost(postId: string) {
    const postToUpdate = this.posts.find(pos => pos._id === postId);

    if (postToUpdate) {
      this.postServ.putA(postId, postToUpdate.newText).subscribe(result => {
        this.postServ.getArticles().subscribe((res: any) => {
          this.posts = res['articles'].sort(this.sortPost);
        });
      });
    }
  }


  editComment(postId: string, commentId: number) {
    const post = this.posts.find(pos => pos._id === postId);
    const commentToUpdate = post ? post.comments.find((com:any) => com._id === commentId) : null;

    if (commentToUpdate) {
      this.postServ.putArticles(postId, commentToUpdate.newText, commentId).subscribe(result => {

        this.postServ.getArticles().subscribe((res: any) => {
          this.posts = res['articles'].sort(this.sortPost);
        });
      });
    }
  }


  addReply(postId: string) {
    const commentId = -1;
    const ele = 'newReply' + postId;
    const text = (<HTMLInputElement>document.getElementById(ele)).value;
    this.postServ.putArticles(postId, text, commentId).subscribe(result => {
      this.postServ.getArticles().subscribe( (res:any) => {
        this.posts = res['articles'].sort(this.sortPost);
      });
    });
  }
}
