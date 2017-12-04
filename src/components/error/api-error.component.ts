import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
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
	templateUrl: './api-error.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiErrorComponent implements OnChanges {
    /** An error response passed by the API or the application */
	@Input() error: IErrorApi; // The error object 
	/** An error response passed by the API or the application */
	@Input() message: string = 'An unknown error occured'; // The error object 
    /** Whether or not to show all the error details passed by the API. If false will only show the error.msg */
	@Input() showDetails: boolean = true; // The error object
    /** Array of keys in API error response */
	public errorOfKeys: string[];

	public errorMessage: string;
    /** API response keys to ignore */
    private ignoreProps: string[] = ['headers', 'errorMsg'];

	constructor(
	) {
		this.message = 'An unknown error occured';
		this.showDetails = true;
	}

	public ngOnChanges() {
		if (this.error) {
			this.createError();
		}
	}

	public createError() {
		// Create an array of keys to loop through and filter out anything on the ignore list
		this.errorOfKeys = Object.keys(this.error).filter((key) => {
			if (this.ignoreProps.indexOf(key) == -1) {
				return key;
			}
		});

		// If errorMsg was not set and an error message was found in the server response, use the server message instead
		//if (!this.errorMessage && this.error && this.error._body && this.error._body.message) {
		//	this.errorMessage = JSON.parse(this.error._body).message;
		//}
		// If 404
		if (!this.errorMessage && this.error.status == 404) {
			this.errorMessage = '404 Error. Unable to connect to the Api.';
		}
		// If no error message
		else if (!this.errorMessage) {
			this.errorMessage = 'Unknown error. Please see error details for more information.'
		}
	}

    /**
     * Hide alert message
     */
	public closeAlert(): void {
		this.error = null;
	}

}
