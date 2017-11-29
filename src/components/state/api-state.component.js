"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ApiStateComponent = (function () {
    function ApiStateComponent() {
        /** Should the success/loading/error messages appear inline or as a toaster pop in the lower right of the screen */
        this.toaster = true;
        /** Should the success message be visible or not */
        this.showSuccess = true;
        /** Set this flag after the initial load of data */
        this.initialLoadComplete = false;
        /** Toggle the visibility of the success message */
        this.successVisible = true;
    }
    ApiStateComponent.prototype.ngOnInit = function () { };
    ApiStateComponent.prototype.ngOnChanges = function () {
        if (this.state.loaded) {
            this.initialLoadComplete = true;
        }
        this.successVisible = true;
    };
    /**
     * Close the alert and clear success state
     */
    ApiStateComponent.prototype.closeSuccess = function () {
        this.successVisible = false;
        //this.api.resetSuccess();
    };
    ApiStateComponent.prototype.ngOnDestroy = function () { };
    __decorate([
        core_1.Input()
    ], ApiStateComponent.prototype, "state");
    __decorate([
        core_1.Input()
    ], ApiStateComponent.prototype, "toaster");
    __decorate([
        core_1.Input()
    ], ApiStateComponent.prototype, "showSuccess");
    ApiStateComponent = __decorate([
        core_1.Component({
            selector: 'api-state',
            templateUrl: './api-state.component.html',
            styles: ["\n        .toaster{position:fixed;bottom:10px;right:20px;z-index:1000;}\n        .toaster-lg{font-size:3rem;}\n    "],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], ApiStateComponent);
    return ApiStateComponent;
}());
exports.ApiStateComponent = ApiStateComponent;
