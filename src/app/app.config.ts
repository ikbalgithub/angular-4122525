import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { LocalStorageWrapper, persistCache, persistCacheSync } from 'apollo3-cache-persist';
import { InMemoryCache } from '@apollo/client';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';


import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { AuthorizationState } from './store/authorization/authorization.state';
import { ProfileState } from './store/profile/profile.state';
import { httpInterceptor } from './interceptors/http/http.interceptor';
import { HistoryState } from './store/history/history.state';
import { MessagesState } from './store/messages/messages.state';


const uri = 'https://8000-idx-nest-3141825-1736324093764.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev/graphql'

const initCache = async () => {
  const cache = new InMemoryCache()
  const storage = new LocalStorageWrapper(window.localStorage)
  await persistCache({cache,storage})
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    {provide:APP_INITIALIZER,useFactory:() => initCache,multi:true},
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideApollo(() => {
      const cache = new InMemoryCache()
      const storage = new LocalStorageWrapper(
        window.localStorage
      )
      persistCacheSync(
        {
          cache,
          storage
        }
      )
      const httpLink = inject(
        HttpLink
      )
      return {
        link:httpLink.create({uri}),
        connectToDevTools:true,
        cache
      }
    }),
    provideRouter(routes),
    provideStore(
      [AuthorizationState,ProfileState,HistoryState,MessagesState], 
      withNgxsStoragePlugin({keys: '*'}),
      withNgxsLoggerPlugin(),
    )
  ]
};
