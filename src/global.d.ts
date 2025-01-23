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

    interface SendMessageResult{
      sendMessage:{
        _id:string,
        groupId:string,
        value:string,
        sender:string,
        receiver:string,
        read:boolean,
        contentType:string,
        description:string,
        sendAt:number,
      }
    }
    
    interface GetMessagesResult{
      getMessages:SendMessageResult.sendMessage[]
    }
  }

  namespace Shared{
    interface Profile{
      profileImage:string,
      surname:string,
      firstName:string,
      usersRef:string
    }
  }

  namespace Ngxs{
    interface History{
      _id:string,
      groupId:string,
      lastMessage:Message.Last|null,
      profile:Shared._Profile
    }
  }

  namespace Message{
    interface Last{
      _id:string,
      contentType:string,
      value:string,
      sendAt:number
      read:boolean,
      send:boolean,
      sender:string
    }  
    type M = Graphql.SendMessageResult & {
      send:boolean
    }
  }


}

export{
  // exporting all interface and type
}