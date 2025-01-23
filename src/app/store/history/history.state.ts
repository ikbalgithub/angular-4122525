import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { AddHistory, EditHistory } from "./history.actions";

@State<Ngxs.History[]>({
  name:'history',
  defaults:[]
})

@Injectable() export class HistoryState{
  @Action(AddHistory) add(ctx:StateContext<Ngxs.History[]>,act:AddHistory){
    ctx.setState(state => [
      ...state,
      act.payload
    ])
  }

  @Action(EditHistory) edit(ctx:StateContext<Ngxs.History[]>,act:EditHistory){
    var state = [...ctx.getState()]
    var [filter] = state.filter(h => {
      return h._id === act.payload.f
    })

    var index = state.findIndex(s => {
      return s._id === filter._id
    })
    
    state[index].lastMessage = act.payload.m

    ctx.setState(state)

  }
}