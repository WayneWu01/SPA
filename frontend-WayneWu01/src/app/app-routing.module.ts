import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {RegistrationComponent} from "./auth/registration/registration.component";
import {MainComponent} from "./main/main.component";
import {ProfileComponent} from "./profile/profile.component";


const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'main', component: MainComponent},
  {path: 'profile', component: ProfileComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
