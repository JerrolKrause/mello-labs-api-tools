import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
/**
 <api-error *ngIf="state.modifyError" [error]="state.modifyError"></api-error>
 */
export interface IErrorApi {
	errorMsg?: string;
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
	selector: 'api-error',
	templateUrl: './api-error.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiErrorComponent implements OnInit {
    /** An error response passed by the API or the application */
	@Input() error: IErrorApi; // The error object 
    /** Whether or not to show all the error details passed by the API. If false will only show the error.msg */
	@Input() showDetails: boolean = true; // The error object
    /** Array of keys in API error response */
	public errorOfKeys: string[];
    /** Is the error visible */
	public isVisible: boolean = true;
    /** API response keys to ignore */
    private ignoreProps: string[] = ['headers', 'errorMsg'];

	constructor(
	) { }

	ngOnInit() {

        // Create an array of keys to loop through and filter out anything on the ignore list
        this.errorOfKeys = Object.keys(this.error).filter((key) => {
            if (this.ignoreProps.indexOf(key) == -1) {
                return key;
            }
        });
        // If errorMsg was not set and an error message was found in the server response, use the server message instead
		if (!this.error.errorMsg && this.error._body && JSON.parse(this.error._body) && JSON.parse(this.error._body).message) {
			this.error.errorMsg = JSON.parse(this.error._body).message;
		}
        // If 404
		else if (!this.error.errorMsg && this.error.status == 404) {
			this.error.errorMsg = '404 Error. Unable to connect to the Api.';
		}
        // If no error message
		else if (!this.error.errorMsg) {
			this.error.errorMsg = 'Unknown error. Please see error details for more information.'
		}
	}

    /**
     * Hide alert message
     */
	public closeAlert(): void {
		//this.api.resetErrors();
		this.error = null;
		this.isVisible = false;
	}

}
