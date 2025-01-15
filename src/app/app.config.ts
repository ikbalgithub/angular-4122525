import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { LocalStorageWrapper, persistCache, persistCacheSync } from 'apollo3-cache-persist';
import { InMemoryCache } from '@apollo/client';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';


import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsFormPlugin } from '@ngxs/form-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsWebSocketPlugin } from '@ngxs/websocket-plugin';

const uri = 'https://3000-idx-nest-3141825-1736324093764.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev/graphql'

const initCache = async () => {
  const cache = new InMemoryCache()
  const storage = new LocalStorageWrapper(window.localStorage)
  await persistCache({cache,storage})
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide:APP_INITIALIZER,
      useFactory:() => initCache,
      multi:true
    },
    provideHttpClient(),
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
        cache
      }
    })
    ,
    provideRouter(routes),
    provideStore()
  ]
};
