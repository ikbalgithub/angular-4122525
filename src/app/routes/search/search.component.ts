import { Component, inject, signal } from '@angular/core';
import { GraphqlModule } from '../../graphql/graphql.module';
import { GraphqlService } from '../../graphql/graphql.service';
import { QUERY_SEARCH } from '../../graphql/graphql.queries';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  result:Shared.Profile[] = []
  graphql = inject(GraphqlService)
  
  onSearchKeywordChange(target:any){
    var keyword = target.value as string
    if(keyword.length > 0) this.search(keyword)
  }

  search(username:string){
    var variables = {username:username}
    this.graphql.query<Graphql.SearchResult,typeof variables>({
      query:QUERY_SEARCH,
      variables:variables
    })
    .subscribe(r => {
      this.result = r.data.search.map(rr => {
        return rr.profile
      })
    })
  }
}
