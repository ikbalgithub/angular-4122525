import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetAuthorization } from "./authorization.actions";

@State<string|null>({
  name: 'authorization',
  defaults: null
})

@Injectable() export class AuthorizationState{
  @Action(SetAuthorization) setAuthorization (ctx:StateContext<string|null>,act:SetAuthorization){
    ctx.setState(act.payload)
  }

  @Selector() static isAuthenticated(state:string|null){
    return Boolean(state)
  }
}