import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
/**
<api-state [state]="conditions.state" ignore="modifying" [hover]="true" *ngIf="conditionsState$ | async as conditions">
Transcluded content here
</api-state>
 */
export interface ApiStatus {
  loading?: boolean;
  loaded?: boolean;
  loadError?: any;

  modifying?: boolean;
  modified?: boolean;
  modifyError?: any;
}

@Component({
  selector: 'api-state',
  templateUrl: './api-state.component.html',
  styles: [
    `
        .toaster{position:fixed;bottom:10px;right:20px;z-index:1000;}
        .toaster-lg{font-size:3rem;}
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiStateComponent implements OnChanges {
  /** API State */
  @Input() state: ApiStatus;
  /** Should the success/loading/error messages appear inline or as a toaster pop in the lower right of the screen */
  @Input() toaster = true;
  /** Should the success message be visible or not */
  @Input() showSuccess = true;
  /** Set this flag after the initial load of data */
  public initialLoadComplete = false;
  /** Toggle the visibility of the success message */
  public successVisible = true;

  constructor() {}

  ngOnChanges() {
    if (this.state.loaded) {
      this.initialLoadComplete = true;
    }
    this.successVisible = true;
  }

  /**
   * Close the alert and clear success state
   */
  public closeSuccess() {
    this.successVisible = false;
    //this.api.resetSuccess();
  }
}
