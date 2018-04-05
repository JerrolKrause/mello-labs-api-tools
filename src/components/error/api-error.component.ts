import { Component, Input, ChangeDetectionStrategy, OnChanges, ViewEncapsulation } from '@angular/core';
/**
 <api-error *ngIf="state.modifyError" [error]="state.modifyError"></api-error>
 */
export interface IErrorApi {
  headers?: object;
  message?: string;
  ok?: boolean;
  status?: number;
  _body?: string;
  statusText?: string;
  type?: number;
  url?: string;
}

@Component({
  selector: 'error',
  styles: [`#errorApi .card{box-shadow:none;}`],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './api-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiErrorComponent implements OnChanges {
  /** An error response passed by the API or the application */
  @Input() error: IErrorApi; // The error object 
  /** An error response passed by the API or the application */
  @Input() message: string; // The error object 
  /** Whether or not to show all the error details passed by the API. If false will only show the error.msg */
  @Input() showDetails = true; // The error object
  /** Array of keys in API error response */
  public errorOfKeys: string[];

  public errorMessage: string;
  /** API response keys to ignore */
  private ignoreProps: string[] = ['headers', 'errorMsg'];

  constructor(
  ) {
  }

  public ngOnChanges() {
    if (this.error) {
      this.createError(this.error, this.message);
    }
  }

  public createError(error: IErrorApi, message: string) {

    // Create an array of keys to loop through and filter out anything on the ignore list
    this.errorOfKeys = Object.keys(error).filter((key) => {
      if (this.ignoreProps.indexOf(key) === -1) {
        return key;
      }
    });

    // If custom message supplied, use that
    if (message) {
      this.errorMessage = message;
    }
    // Internal message on .error object
    else if (!message && (<any>error).error && (<any>error).error.message) {
      this.errorMessage = (<any>error).error.message;
    }
    // If 404
    else if (!message && error.status === 404) {
      this.errorMessage = '404 Error. Unable to connect to the server';
    }
    // If no error message
    else {
      this.errorMessage = 'Unknown error. Please see error details for more information'
    }
  }

  /**
   * Hide alert message
   */
  public closeAlert(): void {
    this.error = null;
  }

}
