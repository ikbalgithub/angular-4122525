import { Injectable } from "@angular/core"
import { State, Action, StateContext, Selector } from "@ngxs/store"
import { Messages, SelectX } from "./messages.actions"

@State<Message.M[]>({
  name: 'messages',
  defaults:[]
})
@Injectable() export class MessagesState{
  @Action(Messages) 
  
  init(ctx:StateContext<Message.M[]>,act:Messages){
    var state = ctx.getState()
    ctx.setState([...state,act.payload])
  }

  @Selector() 
  
  get(state: Message.M[]) {
    return (_id: string) => {
      return state.filter(s => s._id === _id)[0];
    };
  }
}