import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-history',
  imports: [CommonModule,RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  store = inject(Store)
  router = inject(Router)
  profile = this.store.selectSnapshot<Shared.Profile>(s => {
    return s.profile
  })
  history = this.store.selectSignal<Ngxs.History[]>(s => {
    return s.history
  })

  select(usersRef:string){
    var [filter] = this.history().filter(
      h => h.profile.usersRef = usersRef
    )
    return filter.profile
  }
}
