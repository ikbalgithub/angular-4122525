import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';

export const httpInterceptor: HttpInterceptorFn = (req,next) => {
  const store = inject(Store)
  const token = store.selectSnapshot(s => s.authorization)
  const loggedIn = Boolean(token)
  
  const newReq = !loggedIn ? req : req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })

  return next(
    newReq
  )
};

interface Profile{
  profileImage:string
}