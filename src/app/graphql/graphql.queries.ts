import { gql } from "apollo-angular";

export const QUERY_TEST = gql`
  query($credential:LoginDto!){
    test(credential:$credential){
      username
      password
    }
  }
`