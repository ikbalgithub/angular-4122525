import { Store } from '@ngxs/store';
import { Types } from 'mongoose';
import { Location } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { AddHistory, EditHistory, ReplaceHistory } from '../../store/history/history.actions';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from "../../partials/history/history.component";
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../../graphql/graphql.service';
import { MUTATION_SEND_MESSAGE } from '../../graphql/graphql.mutation';
import { QUERY_GET_MESSAGES } from '../../graphql/graphql.queries';
import { Messages } from '../../store/messages/messages.actions';
import { MessagesState } from '../../store/messages/messages.state';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WatchQueryFetchPolicy } from '@apollo/client';

@Component({
  imports: [CommonModule,HistoryComponent,FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  message     = ''
  store       = inject(Store)
  location    = inject(Location)
  graphql     = inject(GraphqlService)
  route       = inject(ActivatedRoute)
  routeId     = this.route.snapshot.params['_id']
  profile2    = window.history.state._ as Shared.Profile
  groupId     = window.history.state.groupId as string
  url         = undefined as Tmp<Subscription>
  fetchPolicy = 'cache-only' as WatchQueryFetchPolicy

  profile1 = this.store.selectSnapshot<Shared.Profile>(s => {
    return s.profile
  })
  history  = this.store.selectSignal<Ngxs.History[]>(state => {
    return state.history
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

    this.store.dispatch(new ReplaceHistory(
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
      next:r => this.onSuccessSendMessage(r.data),
      error:e => console.log(e.message)
    })
  }

  onSuccessSendMessage(r:any){
    r = r as Graphql.SendMessageResult
    
  }

  setHistoryAndGroupId(){
    var [filter] = this.history().filter(h => {
      return h._id === this.profile2.usersRef
    })

    if(filter){
      // set groupId
      this.groupId = filter.groupId
    }

    if(!filter){
      var groupId = new Types.ObjectId()
      var groupIdStr = groupId.toString()
      
      // tambahkan history terbaru
      this.store.dispatch(new AddHistory({
        _id:this.profile2.usersRef,
        groupId:groupIdStr,
        profile:this.profile2,
        lastMessage:null
      }))

      // buat groupId
      this.groupId = groupIdStr
    }
  }

  isCached(){
    var cache = this.graphql.client.readQuery<Graphql.GetMessagesResult>(
      {
        query:QUERY_GET_MESSAGES,
        variables:{_id:this.routeId}
      }
    )

    this.fetchPolicy = cache ? 'cache-only':'network-only'

    
    return cache?.getMessages
  }

  fetch(_id:string){
    var variables = {
      $_id:_id
    }
    this.graphql.query<Graphql.GetMessagesResult,typeof variables>({
      query:QUERY_GET_MESSAGES,
      fetchPolicy:this.fetchPolicy,
      variables
    })
    .subscribe(r => {
      console.log(r)
    })
  }

  ngOnInit(){
    this.url = this.route.url.subscribe(c => {   
      if(this.route.snapshot.params['_id'] !== this.routeId){
        this.routeId = this.route.snapshot.params['_id']
        this.groupId = window.history.state.groupId
        this.profile2 = window.history.state._
        this.isCached()
        this.fetch(this.routeId)
        this.setHistoryAndGroupId()
      }
      else{
        this.isCached()
        this.fetch(this.routeId)
        this.setHistoryAndGroupId()
      }
    })
  }
}

type Tmp<T> = T | undefined
