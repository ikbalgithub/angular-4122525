import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app = initializeApp({
    apiKey: "AIzaSyCwaR1rO8KBMknwhX2heD1_xEIoIV3qKtI",
    authDomain: "angular-3131825.firebaseapp.com",
    projectId: "angular-3131825",
    storageBucket: "angular-3131825.firebasestorage.app",
    messagingSenderId: "1042370316731",
    appId: "1:1042370316731:web:a66788faa7553374799c9e"
  })
}
