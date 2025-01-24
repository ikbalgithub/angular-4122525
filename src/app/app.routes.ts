import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MessagesComponent } from './pages/messages/messages.component'
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth/auth.guard';
import { SearchComponent } from './pages/search/search.component';
import { MessageComponent } from './pages/message/message.component';

export const routes: Routes = [
  {path:'',component:HomeComponent,canActivate:[authGuard]},
  {path:'messages',component:MessagesComponent,canActivate:[authGuard]},
  {path:'messages/:_id',component:MessageComponent,canActivate:[authGuard]},
  {path:'login',component:LoginComponent,canActivate:[authGuard]},
  {path:'register',component:RegisterComponent},
  {path:'search',component:SearchComponent},
];
