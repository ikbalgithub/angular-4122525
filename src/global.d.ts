declare global{
  interface SIGNUPWITHGOOGLERESULT {
    uid:string,
    photoURL:string|null,
    displayName:string|null
  }

  interface REGISTERRESULT{
    register:{
      existed:boolean,
      authorization:string,
      username:string,
      _id:string
    }
  }

  interface REGISTERDTO{
    dto:{
      oauthReference:string
    }
  }

  interface CREATEPROFILERESULT{
    createProfile:{
      _id:string,
      profileImage:string,
      surname:string,
      firstName:string,
      usersRef:string
    }
  }
}

export{
  // exporting all interface and type
}