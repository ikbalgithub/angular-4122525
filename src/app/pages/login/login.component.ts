import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { GraphqlService } from '../../graphql/graphql.service';
import { MUTATION_CREATE_PROFILE, MUTATION_REGISTER } from '../../graphql/graphql.mutation';
import { Store } from '@ngxs/store';
import { Authorization } from '../../store/authorization/authorization.actions';
import { Profile } from '../../store/profile/profile.actions';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  clicked = false
  store = inject(Store)
  graphql = inject(GraphqlService)
  router = inject(Router)
  firebase = inject(FirebaseService)

  onSuccessSignUpWithGoogle(result:Oauth.SignUpWithGoogleResult){
    var oauthReference = result.uid
    var vars = {dto:{oauthReference}}
    this.graphql.mutate<Graphql.RegisterResult,typeof vars>({
      mutation:MUTATION_REGISTER,
      variables:vars
    })
    .subscribe(r => {
      var data = r.data as Graphql.RegisterResult
      this.next(result,data)
    })
  }

  next(result:Oauth.SignUpWithGoogleResult,data:Graphql.RegisterResult){
    var profileImage = result.photoURL as string
    var name = result.displayName as string
    var authorization = data.register.authorization
    var [firstName,surname] = name.split(' ')
    var usersRef = data.register._id

    var vars = {
      dto:{
        profileImage,
        surname,
        firstName,
        usersRef
      }
    }

    if(data.register.existed){
       var profile = {
         profileImage,
         firstName,
         surname,
         usersRef
       }

       this.store.dispatch(new Authorization(authorization))
       this.store.dispatch(new Profile(profile))
       this.router.navigate([''])
    }
    else{
      this.graphql.mutate<Graphql.CreateProfileResult,typeof vars>({
        mutation:MUTATION_CREATE_PROFILE,
        variables:vars
      })
      .subscribe(r => {
        var profile = r.data?.createProfile as Shared.Profile
        this.store.dispatch(new Authorization(authorization))
        this.store.dispatch(new Profile(profile))
        this.router.navigate([''])
      })
    }
  }


  async loginWithGoogle(){
    this.clicked = true

    try{
      var auth = getAuth()
      var provider = new GoogleAuthProvider()
      var account = await signInWithPopup(auth,provider)
      this.onSuccessSignUpWithGoogle(account.user.providerData[0])
    }
    catch(e:any){
      console.error(e)
    }
  }
}
