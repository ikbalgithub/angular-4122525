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

export const MUTATION_CREATE_PROFILE = gql`
  mutation($dto:CreateProfileDto!){
    createProfile(dto:$dto){
      profileImage
      firstName
      surname
    }
  }
`

export const MUTATION_SEND_MESSAGE = gql`
  mutation($dto:NewMessageDto!){
    sendMessage(dto:$dto){
      _id
      sender
      receiver
      value
      contentType
      description
      read
      sendAt
    }
  }
`