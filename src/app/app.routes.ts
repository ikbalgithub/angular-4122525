import { Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { HomeComponent } from './routes/home/home.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './routes/register/register.component';

export const routes: Routes = [
  {path:'login',component:LoginComponent,canActivate:[authGuard]},
  {path:'',component:HomeComponent,canActivate:[authGuard]},
  {path:'register',component:RegisterComponent}
];
