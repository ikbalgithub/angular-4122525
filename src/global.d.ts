declare global{
  interface SIGNUPWITHGOOGLERESULT {
    uid:string,
    photoURL:string|null,
    displayName:string|null
  }

  interface REGISTERRESULT{
    data:{
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
}

export{
  // exporting all interface and type
}