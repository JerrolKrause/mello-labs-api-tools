import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap
import {
  ApiErrorComponent,
} from './components/error/api-error.component';
import {
  ApiStateComponent,
} from './components/state/api-state.component';

export * from './utils/api-utils';
export * from './components/error/api-error.component';
export * from './components/state/api-state.component';
export * from './services/api.actions';
export * from './services/api.http.service';
export * from './services/api.actions';
export * from './services/api.reducer';
export * from './services/api-status.reducer';

@NgModule({
  imports: [CommonModule, NgbModule.forRoot()],
  declarations: [ApiErrorComponent, ApiStateComponent],
  exports: [ApiErrorComponent, ApiStateComponent]
})
export class ApiToolsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApiToolsModule,
      providers: []
    };
  }
}
