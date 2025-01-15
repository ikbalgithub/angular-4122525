import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  var router = inject(Router)
  var onLoginPage = state.url === '/login'
  var jwt = localStorage.getItem('authorization')
  var loggedIn = jwt ? true : false

  if(!loggedIn && !onLoginPage){
    router.navigate(['login'])
  }
  if(loggedIn && onLoginPage){
    router.navigate([''])
  }
  
  return loggedIn
    ? onLoginPage
      ? false
      : true
    : onLoginPage
      ? true
      : false
};
