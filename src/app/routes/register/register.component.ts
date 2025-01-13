import { Component, inject } from '@angular/core';
import { GoogleAuthProvider,getAuth,signInWithPopup } from "firebase/auth";
import { FirebaseService } from '../../services/firebase/firebase.service';
import { GraphqlService } from '../../graphql/graphql.service';
import { QUERY_TEST } from '../../graphql/graphql.queries';
import { MUTATION_REGISTER } from '../../graphql/graphql.mutation';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  graphql = inject(GraphqlService)
  firebase = inject(FirebaseService)

  onSuccessSignInWithGoogle({uid,...rest}:any){
    var dto = {oauthReference:uid}
    this.graphql.mutate(
      {
        mutation:MUTATION_REGISTER,
        variables:{dto:dto}
      }
    )
    .subscribe(
      r => this.login(r.data)
    )
  }

  login({existed,...rest}:any){
    if(existed){

    }
    else{
      
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
    try{
      var auth = getAuth()
      var provider = new GoogleAuthProvider()
      var account = await signInWithPopup(auth,provider)
      this.onSuccessSignInWithGoogle(account.user.providerData[0])
    }
    catch(e:any){
      console.error(e)
    }
  }
}
