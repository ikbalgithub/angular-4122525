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

export const MUTATION_UPDATE_MESSAGE = gql`
  mutation($dto:UpdateMessageDto!){
    updateMessage(dto:$dto){
      matchedCount
      modifiedCount
      upsertedCount
      acknowledged
    }
  }
`

export const MUTATION_UPDATE_MESSAGE_BY_SENDER = gql`
  mutation($dto:UpdateMessageDto!){
    updateMessageBySender(dto:$dto){
      matchedCount
      modifiedCount
      upsertedCount
      acknowledged
    }
  }
`