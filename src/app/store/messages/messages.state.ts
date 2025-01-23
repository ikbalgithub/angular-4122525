import { Injectable } from "@angular/core"
import { State, Action, StateContext, Selector } from "@ngxs/store"
import { Messages } from "./messages.actions"

@State<Message.M[]>({
  name: 'messages',
  defaults:[]
})
@Injectable() export class MessagesState{
  @Action(Messages) set(ctx:StateContext<Message.M[]>,act:Messages){
    ctx.setState(act.payload)
  }
}