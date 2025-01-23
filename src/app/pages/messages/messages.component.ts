import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Authorization } from '../../store/authorization/authorization.actions';
import { Profile } from '../../store/profile/profile.actions';
import { ProfileState } from '../../store/profile/profile.state';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from "../../partials/history/history.component";

@Component({
  selector: 'app-messages',
  imports: [CommonModule, HistoryComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  store = inject(Store)
  router = inject(Router)
  profile = this.store.selectSnapshot<Shared.Profile>(state => {
    return state.profile
  })
  history = this.store.selectSignal<Ngxs.History[]>(state => {
    return state.history
  })

  logout(){
    this.store.dispatch(new Authorization(null))
    this.store.dispatch(new Profile(null))
    this.router.navigate([''])
  }
}
