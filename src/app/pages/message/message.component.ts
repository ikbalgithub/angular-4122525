import { Store } from '@ngxs/store';
import { Types } from 'mongoose';
import { Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AddHistory, EditHistory } from '../../store/history/history.actions';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from "../../partials/history/history.component";
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../../graphql/graphql.service';
import { MUTATION_SEND_MESSAGE } from '../../graphql/graphql.mutation';
import { QUERY_GET_MESSAGES } from '../../graphql/graphql.queries';
import { Messages } from '../../store/messages/messages.actions';

@Component({
  imports: [CommonModule,HistoryComponent,FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  message  = ''
  store    = inject(Store)
  location = inject(Location)
  graphql  = inject(GraphqlService)
  profile2  = window.history.state._ as Shared.Profile
  groupId  = window.history.state.groupId as string
  profile1 = this.store.selectSnapshot<Shared.Profile>(s => {
    return s.profile
  })
  history  = this.store.selectSignal<Ngxs.History[]>(state => {
    return state.history
  })
  messages  = this.store.selectSignal<Message.M[]>(state => {
    return state.messages
  })

  send(){
    var groupId = this.groupId
    var value = this.message
    var sender = this.profile1.usersRef
    var receiver = this.profile2.usersRef
    var _id = new Types.ObjectId().toString()

    var [filter] = this.history().filter(h => {
      return h._id === this.profile2.usersRef
    })

    this.store.dispatch(new EditHistory(
      {
        f:this.profile2.usersRef,
        m:{
          _id,
          sender,
          contentType:'text',
          value,
          read:false,
          send:false,
          sendAt:Date.now()
        }
      }
    ))
  
    var vars ={
      dto:{
        _id,
        groupId,
        value,
        sender,
        receiver,
        read:false,
        contentType:'text',
        description:'empty',
        sendAt:Date.now(),
      }     
    }

    this.graphql.mutate<Graphql.SendMessageResult,typeof vars>({
      mutation:MUTATION_SEND_MESSAGE,
      variables:vars
    })
    .subscribe({
      next:r => console.log(r),
      error:e => console.log(e.message)
    })
  }

  ngOnInit(){
    var [filter] = this.history().filter(h => {
      return h._id === this.profile2.usersRef
    })

    if(filter){
      this.groupId = filter.groupId
    }

    if(!filter){
      var groupId = new Types.ObjectId()
      var groupIdStr = groupId.toString()
      
      this.store.dispatch(new AddHistory({
        _id:this.profile2.usersRef,
        groupId:groupIdStr,
        profile:this.profile2,
        lastMessage:null
      }))

      this.groupId = groupIdStr
    }


    var variables = {
      _id:this.profile2.usersRef
    }
    this.graphql.query<Graphql.GetMessagesResult,typeof variables>({
      query:QUERY_GET_MESSAGES,
      variables
    })
    .subscribe(r => {
      if(r.data.getMessages.length > 0){
        var lastMessage = r.data.getMessages[r.data.getMessages.length -1]
        this.store.dispatch(new Messages(
          r.data.getMessages.map(m => {
            return {
              ...m,
              send:true
            }
          })
        ))


        this.store.dispatch(new EditHistory(
          {
            f:this.profile2.usersRef,
            m:{
              _id:lastMessage._id,
              sender:lastMessage.sender,
              contentType:lastMessage.contentType,
              value:lastMessage.value,
              read:lastMessage.read,
              send:true,
              sendAt:Date.now()
            }
          }
        ))
      }
    })
  }
}
