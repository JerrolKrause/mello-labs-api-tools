"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ApiErrorComponent = (function () {
    function ApiErrorComponent() {
        /** Whether or not to show all the error details passed by the API. If false will only show the error.msg */
        this.showDetails = true; // The error object
        /** Is the error visible */
        this.isVisible = true;
        /** API response keys to ignore */
        this.ignoreProps = ['headers', 'errorMsg'];
    }
    ApiErrorComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Create an array of keys to loop through and filter out anything on the ignore list
        this.errorOfKeys = Object.keys(this.error).filter(function (key) {
            if (_this.ignoreProps.indexOf(key) == -1) {
                return key;
            }
        });
        // If errorMsg was not set and an error message was found in the server response, use the server message instead
        if (!this.error.errorMsg && this.error._body && JSON.parse(this.error._body) && JSON.parse(this.error._body).message) {
            this.error.errorMsg = JSON.parse(this.error._body).message;
        }
        else if (!this.error.errorMsg && this.error.status == 404) {
            this.error.errorMsg = '404 Error. Unable to connect to the Api.';
        }
        else if (!this.error.errorMsg) {
            this.error.errorMsg = 'Unknown error. Please see error details for more information.';
        }
    };
    /**
     * Hide alert message
     */
    ApiErrorComponent.prototype.closeAlert = function () {
        //this.api.resetErrors();
        this.error = null;
        this.isVisible = false;
    };
    __decorate([
        core_1.Input()
    ], ApiErrorComponent.prototype, "error");
    __decorate([
        core_1.Input()
    ], ApiErrorComponent.prototype, "showDetails");
    ApiErrorComponent = __decorate([
        core_1.Component({
            selector: 'api-error',
            templateUrl: './api-error.component.html',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], ApiErrorComponent);
    return ApiErrorComponent;
}());
exports.ApiErrorComponent = ApiErrorComponent;
