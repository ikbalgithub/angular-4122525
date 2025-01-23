import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthorizationState } from '../../store/authorization/authorization.state';

export const authGuard: CanActivateFn = (route,state) => {
  var router = inject(Router)
  var store = inject(Store)
  var onLoginPage = state.url === '/login'
  var loggedIn = store.selectSnapshot(s => {
    return Boolean(s.authorization)
  })
 
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
