import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Profile } from "./profile.actions";

@State<Shared.Profile|null>({
  name: 'profile',
  defaults: null
})

@Injectable() export class ProfileState{
  @Action(Profile) set(ctx:StateContext<Shared.Profile|null>,act:Profile){
    ctx.setState(act.payload)
  }

  @Selector() static getCurrent(state:Shared.Profile|null){
    return state
  }
}