import { Store } from '@ngxs/store';
import { Types } from 'mongoose';
import { io } from 'socket.io-client'
import { Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from "../../partials/history/history.component";
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../../graphql/graphql.service';
import { MUTATION_SEND_MESSAGE, MUTATION_UPDATE_MESSAGE, MUTATION_UPDATE_MESSAGE_BY_SENDER } from '../../graphql/graphql.mutation';
import { QUERY_GET_HISTORY, QUERY_GET_MESSAGES } from '../../graphql/graphql.queries';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentNode, WatchQueryFetchPolicy } from '@apollo/client';
import { CommonService } from '../../services/common/common.service';

@Component({
  imports: [CommonModule,HistoryComponent,FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  message     = ''
  common     = inject(CommonService)
  store       = inject(Store)
  location    = inject(Location)
  graphql     = inject(GraphqlService)
  route       = inject(ActivatedRoute)
  routeId     = this.route.snapshot.params['_id']
  profile2    = window.history.state._ as Shared.Profile
  groupId     = new Types.ObjectId().toString()
  url         = undefined as Tmp<Subscription>
  fetchPolicy = 'cache-only' as WatchQueryFetchPolicy

  socket = io('https://8000-idx-nest-3141825-1736324093764.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev')

  profile1 = this.store.selectSnapshot<Shared.Profile>(s => {
    return s.profile
  })

  historyCaches = this.graphql.client.cache.readQuery<any>({
    query:QUERY_GET_HISTORY
  })
  
  send(){
    var now = Date.now()
    var value = this.message
    var sender = this.profile1.usersRef
    var receiver = this.profile2.usersRef
    var _id = new Types.ObjectId().toString()
    var caches = this.isCached() as any[]

    var vars ={
      dto:{
        _id,
        value,
        sender,
        receiver,
        read:false,
        contentType:'text',
        description:'empty',
        sendAt:now,
      }     
    }
    
    var cache = {
      ...vars.dto,
      __typename:"Message",
      status:'inProcess'
    }
   
    var getMessages = [
      ...caches,
      cache
    ]

    this.graphql.client.writeQuery(
      {
        query:QUERY_GET_MESSAGES,
        variables:{_id:this.routeId},
        data:{getMessages}
      }
    )
   
    this.graphql.mutate<Graphql.SendMessageResult,typeof vars>({
      mutation:MUTATION_SEND_MESSAGE,
      variables:vars
    })
    .subscribe({
      next:r => {
        var caches = [...this.isCached() as any[]]
        var [filter] = caches.filter(c => c._id === _id)
        var index = caches.findIndex(c => c._id === _id)

        caches[index] = {
          ...filter,
          status:'successSend'
        }

        var data = {
          getMessages:[
            ...caches
          ]
        }

        this.graphql.client.writeQuery(
          {
            query:QUERY_GET_MESSAGES,
            variables:{_id:this.routeId},
            data:data
          }
        )
      },
      error:e => {
        var caches = [...this.isCached() as any[]]
        var [filter] = caches.filter(c => c._id === _id)
        var index = caches.findIndex(c => c._id === _id)

        caches[index] = {
          ...filter,
          status:'failedSend'
        }

        var data = {
          getMessages:[
            ...caches
          ]
        }

        this.graphql.client.writeQuery(
          {
            query:QUERY_GET_MESSAGES,
            variables:{_id:this.routeId},
            data:data
          }
        )
      }
    })
  }

  onSuccessSendMessage(r:any){
    r = r as Graphql.SendMessageResult
    
  }

  isCached(){
    var cache = this.graphql.client.cache.readQuery<Graphql.GetMessagesResult>(
      {
        query:QUERY_GET_MESSAGES,
        variables:{_id:this.routeId}
      }
    )

    this.fetchPolicy = cache ? 'cache-only':'network-only'
    
    return cache?.getMessages
  }

  setReadTrue(m:DocumentNode,dto:any,byId?:boolean){
    this.graphql.mutate<any,any>({
      mutation:m,
      variables:{
        dto
      }
    })
    .subscribe({
       error: e => console.log(e.message),
       next:r => console.log(r)
     }) 
  }

  fetch(_id:string){
    var variables = {
      _id:_id
    }
    this.graphql.query<Graphql.GetMessagesResult,typeof variables>({
      query:QUERY_GET_MESSAGES,
      fetchPolicy:this.fetchPolicy,
      variables
    })
    .subscribe({
      next:r => {
        var messages = r.data.getMessages
        var message = messages[messages.length - 1]
        var getHistory = [...this.historyCaches.getHistory]

        getHistory.filter((h:any) => {
          return h.profile.usersRef === this.profile2.usersRef
        })
        .forEach(f => {
          let index = getHistory.findIndex((h:any) => {
            return h.profile.usersRef === this.profile2.usersRef
          })
          if(message){
            getHistory[index] = {
              ...f,
              message
            }
            this.graphql.client.cache.writeQuery({
              query:QUERY_GET_HISTORY,
              data:{getHistory}
            })
            this.historyCaches = this.graphql.client.cache.readQuery({
              query:QUERY_GET_HISTORY
            })
          }
        })
        
        if(messages.filter(m => m.sender === this.profile2.usersRef && !m.read).length >0){
          this.setReadTrue(
            MUTATION_UPDATE_MESSAGE_BY_SENDER,
            {
              sender:this.profile2.usersRef,
              receiver:this.profile1.usersRef,
              read:true
            },
            false
          )
        }
      },
      error:e => {
        alert(e.messafe)
      }
    })
  }

 

  createHistory(x:boolean){
    var message = null
    var profile = this.profile2
    if(x){
      let getHistory = [{
        message,
        profile,
        __typename:'History'
      }]

      this.graphql.client.cache.writeQuery({
        query:QUERY_GET_HISTORY,
        data:{getHistory}
      })

      this.historyCaches = this.graphql.client.cache.readQuery({
        query:QUERY_GET_HISTORY
      })
    }
    else{
      let h = {
        profile,
        message,
        __typename:'History'
      }
      var getHistory = [
        ...this.historyCaches.getHistory,
        h
      ]

      this.graphql.client.cache.writeQuery({
        query:QUERY_GET_HISTORY,
        data:{getHistory}
      })

      this.historyCaches = this.graphql.client.cache.readQuery({
        query:QUERY_GET_HISTORY
      })
    }
  }

  ngOnInit(){
    this.url = this.route.url.subscribe(c => {   
      if(this.route.snapshot.params['_id'] !== this.routeId){
        this.socket.disconnect()
        this.routeId = this.route.snapshot.params['_id']
        this.profile2 = window.history.state._
        this.isCached()
        this.fetch(this.routeId)
        this.socket.connect()
      }
      else{
        this.isCached()
        this.fetch(this.routeId)

        if(!this.historyCaches){
          this.graphql.client.cache.writeQuery({
            query:QUERY_GET_HISTORY,
            data:{getHistory:[]}
          })

          this.historyCaches = this.graphql.client.cache.readQuery({
            query:QUERY_GET_HISTORY
          })

          this.createHistory(true)
        }
        else{
         var [f] = this.historyCaches.getHistory.filter(
           (h:any) => {
             var ref = this.profile2.usersRef
             return h.profile.usersRef === ref
           }
         )

         if(!f) this.createHistory(false)
        }
      }
    })

    this.socket.on('connect',() => {
      var ref1 = this.profile1.usersRef
      var ref2 = this.profile2.usersRef
      this.socket.emit('join',`${ref1}/${ref2}`)
    })

    this.socket.on('newMessage',m => {
      var caches = this.isCached() as any[]
      var message = {...m,read:true,status:'successSend',__typename:'Message'}
      var getMessages = [...caches,message]
      this.graphql.client.cache.writeQuery(
        {
          query:QUERY_GET_MESSAGES,
          variables:{_id:this.routeId},
          data:{getMessages}
        }
      )

      var update = {
        sender:m.sender,
        receiver:m.receiver,
        _id:m._id,
        read:true,
      }

      var variables = {dto:update}

      this.graphql.mutate<any,typeof variables>({
        mutation:MUTATION_UPDATE_MESSAGE,
        variables
      })
      .subscribe({
        next:r => {
          console.log(r)
        },
        error:e => {
          console.log(e.message)
        }
      })
    })

    this.socket.on('updateMessage',dto => {
      var caches = [...this.isCached() as any[]]
      var [f] = caches.filter(m => m._id === dto._id)
      var index = caches.findIndex(m => m._id === dto._id)
      
      caches[index] = {...f,...dto}

      this.graphql.client.writeQuery({
        query:QUERY_GET_MESSAGES,
        variables:{_id:this.routeId},
        data:{getMessages:caches}
      })
    })

    this.socket.on('allMessageIsUpdated',() => {
      var caches = [...this.isCached() as any[]]
      
      caches.forEach(c => {
         if(c.sender === this.profile1.usersRef){
           var index = caches.findIndex(m => m._id === c._id)
           caches[index] = {...c,read:true}
         }
      })

      this.graphql.client.writeQuery({
        query:QUERY_GET_MESSAGES,
        variables:{_id:this.routeId},
        data:{getMessages:caches}
      })
    })
  }
}

type Tmp<T> = T | undefined
