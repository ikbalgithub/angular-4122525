import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DocumentNode, MutationFetchPolicy, OperationVariables, WatchQueryFetchPolicy } from '@apollo/client';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  apollo = inject(Apollo)
  
  httpHeaders = new HttpHeaders({
    'authorization':'xxx',
    'bypass-tunnel-reminder':'true',
    'credentials':'include'
  })

  query<R,V extends OperationVariables>(opts:QueryOptions<V>){
    var context = {headers:this.httpHeaders}
    var result =  this.apollo.watchQuery<R,V>(
      {
        ...opts,
        context,
      }
    )

    return result.valueChanges
  }

  mutate<R,V extends OperationVariables>(opts:MutationOptions<V>){
    var context = {headers:this.httpHeaders}
    return this.apollo.mutate<R,V>(
      {
        ...opts,
        context,
      }
    )
    
  }

  constructor() { }
}

type QueryOptions<V> = {
  query:DocumentNode,
  variables?:V,
  context?:any,
  fetchPolicy?:WatchQueryFetchPolicy
}

type MutationOptions<V> = {
  mutation:DocumentNode,
  variables?:V,
  context?:any,
  fetchPolicy?:MutationFetchPolicy
}