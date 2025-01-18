import { gql } from "apollo-angular";

export const QUERY_TEST = gql`
  query($credential:LoginDto!){
    test(credential:$credential){
      username
      password
    }
  }
`

export const QUERY_SEARCH = gql`
  query($username:String!){
    search(username:$username){
      profile{
        profileImage
        surname
        firstName
      }
    }
  }
`