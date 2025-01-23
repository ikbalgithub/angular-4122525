import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Authorization, } from "./authorization.actions";

@State<string|null>({
  name: 'authorization',
  defaults: null
})

@Injectable() export class AuthorizationState{
  @Action(Authorization) set (ctx:StateContext<string|null>,act:Authorization){
    ctx.setState(act.payload)
  }
}