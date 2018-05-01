This project is intended for internal loanDepot/mello Labs use and is not (currently) publically supported. 

# @mello-labs/api-tools

## Installation

To install this library, run:

```bash
$ npm install @mello-labs/api-tools --save
```

## Example Implementation

https://github.com/JerrolKrause/mello-labs-angular-starter/tree/master/src/app/shared/stores/api


## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install @mello-labs/api-tools
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { ApiToolsModule, ApiReducer, ApiStatusReducer } from '@mello-labs/api-tools';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Add the ApiReducer and the ApiStatusReducer to NGRX
    StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer}),
    // Specify your library as an import
    ApiToolsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

To use the API Store automation service, see below.

```typescript
import { ApiHttpService, ApiActions } from '@mello-labs/api-tools';

export class ApiService extends ApiHttpService {

  constructor(
  private http: HttpClient,
  private store: Store<IStore.root>,
  private router: Router
	) {
    super(http, store, router);
	}

    /** Sample store usage */
    public users = {
	    get: (update?: boolean) => this.getStore(ApiMap.users.endpoint, ApiMap.users, update),
		getOne: (user, update?: boolean) => this.getStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, update),
	    post: (user) => this.postStore(ApiMap.users.endpoint, ApiMap.users, user),
		put: (user) => this.putStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
		delete: (user) => this.deleteStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user)
    }
}
```

Create an action for each store property.

```typescript
/** String enum of store properties/primary keys */
export enum ApiActions {
  // Example
  users = 'users',
}

```

In the Api map, specify the relationship from the api to your store.

```typescript
import { AppStore } from '$shared';
import { ApiActions } from './api.actions';

export const ApiMap: AppStore.ApiMapping = {
  // Users Example
  users: {
    endpoint: '//jsonplaceholder.typicode.com/users',
    storeProperty: ApiActions.users,
    uniqueId: 'id',
  },
};
```


Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<sampleComponent></sampleComponent>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```
