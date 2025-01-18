import { Component, inject } from '@angular/core';
import { GoogleAuthProvider,getAuth,signInWithPopup } from "firebase/auth";
import { FirebaseService } from '../../services/firebase/firebase.service';
import { GraphqlService } from '../../graphql/graphql.service';
import { QUERY_TEST } from '../../graphql/graphql.queries';
import { MUTATION_CREATE_PROFILE, MUTATION_REGISTER } from '../../graphql/graphql.mutation';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetAuthorization } from '../../store/authorization/authorization.actions';
import { SetProfile } from '../../store/profile/profile.actions';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  clicked = false
  store = inject(Store)
  router = inject(Router)
  graphql = inject(GraphqlService)
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
      this.login(result,data)
    })
  }

  login(result:Oauth.SignUpWithGoogleResult,data:Graphql.RegisterResult){
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
         surname
       }

       this.store.dispatch(new SetAuthorization(authorization))
       this.store.dispatch(new SetProfile(profile))
       this.router.navigate([''])
    }
    else{
      this.graphql.mutate<Graphql.CreateProfileResult,typeof vars>({
        mutation:MUTATION_CREATE_PROFILE,
        variables:vars
      })
      .subscribe(r => {
        var profile = r.data?.createProfile as Shared.Profile
        this.store.dispatch(new SetAuthorization(authorization))
        this.store.dispatch(new SetProfile(profile))
        this.router.navigate([''])
      })
    }
  }

  test(){
    this.store.dispatch(new SetAuthorization('xxx'))
    console.log('done')
  }

  async signUpWithGoogle(){
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
