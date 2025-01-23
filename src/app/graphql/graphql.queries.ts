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

export const QUERY_GET_MESSAGES = gql`
  query($_id:String!){
    getMessages(_id:$_id){
      _id
      sender
      receiver
      groupId
      value
      sendAt
      read
      contentType
      description
    }
  }
`