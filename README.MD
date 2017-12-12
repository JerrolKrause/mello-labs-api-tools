This project is intended for internal loanDepot/mello Labs use and is not publically supported. 

# @mello-labs/api-tools

## Installation

To install this library, run:

```bash
$ npm install @mello-labs/api-tools --save
```

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

	 // Specify your library as an import
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