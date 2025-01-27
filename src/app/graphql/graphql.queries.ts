import { gql } from "apollo-angular";

export const QUERY_SEARCH = gql`
  query($username:String!){
    search(username:$username){
      profile{
        profileImage
        surname
        firstName
        usersRef
      }
    }
  }
`

export const QUERY_GET_HISTORY = gql`
  query{
    getHistory{
      profile{
        profileImage
        firstName
        surname
        usersRef
      }
      message{
        _id
        value
        sendAt
        read
        sender
        receiver
        contentType
        description
        status
      }
    }
  }
`

export const QUERY_GET_MESSAGES = gql`
  query($_id:String!){
    getMessages(_id:$_id){
      _id
      sender
      receiver
      value
      sendAt
      read
      contentType
      description
      status
    }
  }
`