import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router)
  firebase = inject(FirebaseService)

  login(){
    localStorage.setItem('token','123456')
    this.router.navigate([''])
  }
}
