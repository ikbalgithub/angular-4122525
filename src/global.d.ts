declare global{
  namespace Oauth{
    interface SignUpWithGoogleResult {
      uid:string,
      photoURL:string|null,
      displayName:string|null
    }
  }
  
  namespace Graphql{
    interface RegisterResult{
      register:{
        existed:boolean,
        authorization:string,
        username:string,
        _id:string
      }
    }

    interface CreateProfileResult{
      createProfile:{
        _id:string,
        profileImage:string,
        surname:string,
        firstName:string,
        usersRef:string
      }
    }

    interface SearchResult{
      search:{profile:Shared.Profile}[]
    }
  }

  namespace Shared{
    interface Profile{
      profileImage:string,
      surname:string,
      firstName:string,
    }
  }
}

export{
  // exporting all interface and type
}