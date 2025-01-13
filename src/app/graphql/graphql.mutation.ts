import { gql } from "apollo-angular";

export const MUTATION_REGISTER = gql`
  mutation($dto:RegisterDto!){
    register(dto:$dto){
      existed
      authorization
      username
      _id
    }
  }
`