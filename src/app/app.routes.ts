import { Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { HomeComponent } from './routes/home/home.component';
import { MessagesComponent } from './routes/messages/messages.component'
import { RegisterComponent } from './routes/register/register.component';
import { authGuard } from './guards/auth.guard';
import { SearchComponent } from './routes/search/search.component';

export const routes: Routes = [
  {path:'',component:MessagesComponent,canActivate:[authGuard]},
  {path:'login',component:LoginComponent,canActivate:[authGuard]},
  {path:'register',component:RegisterComponent},
  {path:'search',component:SearchComponent},
];
