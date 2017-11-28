import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiErrorComponent, IErrorApi } from './components/error/api-error.component';
import { ApiStateComponent, ApiStatus } from './components/state/api-state.component'

import { ApiHttpService } from './services/api.http.service';
import { ApiActions } from './services/api.actions';
import { ApiReducer } from './services/api.reducer';
import { ApiStatusReducer } from './services/api-status.reducer';

export * from './components/error/api-error.component';
export * from './components/state/api-state.component'
export * from './services/api.actions';
export * from './services/api.http.service';
export * from './services/api.actions';
export * from './services/api.reducer';
export * from './services/api-status.reducer';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
	  ApiErrorComponent,
	  ApiStateComponent
  ],
  exports: [
	  ApiErrorComponent,
	  ApiStateComponent
  ]
})
export class ApiToolsModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ApiToolsModule,
			providers: []
		};
	}
}
