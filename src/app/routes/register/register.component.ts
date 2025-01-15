import { Component, inject } from '@angular/core';
import { GoogleAuthProvider,getAuth,signInWithPopup } from "firebase/auth";
import { FirebaseService } from '../../services/firebase/firebase.service';
import { GraphqlService } from '../../graphql/graphql.service';
import { QUERY_TEST } from '../../graphql/graphql.queries';
import { MUTATION_CREATE_PROFILE, MUTATION_REGISTER } from '../../graphql/graphql.mutation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  clicked = false
  router = inject(Router)
  graphql = inject(GraphqlService)
  firebase = inject(FirebaseService)

  onSuccessSignUpWithGoogle(result:SIGNUPWITHGOOGLERESULT){
    var oauthReference = result.uid
    
    this.graphql.mutate<REGISTERRESULT,REGISTERDTO>({
      mutation:MUTATION_REGISTER,
      variables:{dto:{oauthReference}}
    })
    .subscribe(r => {
      var data = r.data as REGISTERRESULT
      this.login(result,data)
    })
  }

  login(result:SIGNUPWITHGOOGLERESULT,data:REGISTERRESULT):void{
    var profileImage = result.photoURL
    var name = result.displayName as string
    var authorization = data.register.authorization
    var [firstName,surname] = name.split(' ')
    var usersRef = data.register._id

    var variables = {
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

       localStorage.setItem('authorization',authorization)
       localStorage.setItem('profile',JSON.stringify(profile))
       this.router.navigate([''])
    }
    else{
      this.graphql.mutate<CREATEPROFILERESULT,any>({
        mutation:MUTATION_CREATE_PROFILE,
        variables
      })
      .subscribe(r => {
        var profile = r.data?.createProfile
        localStorage.setItem('authorization',authorization)
        localStorage.setItem('profile',JSON.stringify(profile))
        this.router.navigate([''])
      })
    }
  }

  test(){
    var credential = {
      username:'usr',
      password:'x'
    }
    var variables = {
      credential
    }
    this.graphql.query(
      {
        query:QUERY_TEST,
        variables
      }
    )
    .subscribe(
      r => console.log(r.data)
    )
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
