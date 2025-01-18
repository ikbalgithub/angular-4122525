import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { SetProfile } from "./profile.actions";

@State<Shared.Profile|null>({
  name: 'profile',
  defaults: null
})

@Injectable() export class ProfileState{
  @Action(SetProfile) setProfile (ctx:StateContext<Shared.Profile>,act:SetProfile){
    ctx.setState(act.payload)
  }
}