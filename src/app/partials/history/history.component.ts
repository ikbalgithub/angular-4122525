import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { GraphqlService } from '../../graphql/graphql.service';
import { QUERY_GET_HISTORY } from '../../graphql/graphql.queries';

@Component({
  selector: 'app-history',
  imports: [CommonModule,RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnChanges {
  store = inject(Store)
  router = inject(Router)
  graphql = inject(GraphqlService)
  @Input() _caches!:{getHistory:any[]}
  profile = this.store.selectSnapshot<Shared.Profile>(s => {
    return s.profile
  })
  caches = this.graphql.client.cache.readQuery<any>({
    query:QUERY_GET_HISTORY
  })

  ngOnChanges(changes:SimpleChanges) {
    this.caches = this.graphql.client.cache.readQuery<any>({
      query:QUERY_GET_HISTORY
    })
  }
}
