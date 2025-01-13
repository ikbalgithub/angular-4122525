import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlService } from './graphql.service';
import { ApolloModule } from 'apollo-angular';



@NgModule({
  declarations: [],
  providers:[GraphqlService],
  imports: [CommonModule,ApolloModule]
})
export class GraphqlModule {
  // graphql module
}
