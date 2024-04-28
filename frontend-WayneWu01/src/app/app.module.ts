import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { MainComponent } from './main/main.component';
import { PostsComponent } from './main/posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { LogComponent } from './auth/log/log.component';
import {FormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';
import { FollowComponent } from './main/follow/follow.component';
import { HeadlineComponent } from './main/headline/headline.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegistrationComponent,
    MainComponent,
    PostsComponent,
    ProfileComponent,
    LogComponent,
    FollowComponent,
    HeadlineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
