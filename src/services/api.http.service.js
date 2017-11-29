"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
require("rxjs/add/operator/share");
var api_actions_1 = require("./api.actions");
var ApiHttpService = (function () {
    function ApiHttpService(httpSvc, storeSvc, routerSvc) {
        this.httpSvc = httpSvc;
        this.storeSvc = storeSvc;
        this.routerSvc = routerSvc;
        /** Hold GET requests from an API using the URL as a primary key */
        this.cache = {};
    }
    /**
    * Make a GET request with simple caching
    * @param url - The URL location of the webapi
    * @param updateCache - Refresh the version in the cache
    */
    ApiHttpService.prototype.get = function (url, updateCache) {
        if (updateCache === void 0) { updateCache = false; }
        // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
        if (!this.cache[url] || updateCache) {
            this.cache[url] = this.httpSvc.get(url)
                .publishReplay(1)
                .refCount();
        }
        return this.cache[url];
    }; // end get
    /**
    * Make a GET request and load the results into the store
    * @param url - The URL location of the webapi
    * @param id - The location to put the results in the store
    * @param updateCache - Refresh the version in the cache
    */
    ApiHttpService.prototype.getStore = function (url, apiMap, updateCache) {
        var _this = this;
        if (updateCache === void 0) { updateCache = false; }
        // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
        if (this.cache[url] == null || updateCache) {
            // Set status to waiting
            var newState_1 = { loading: true, loadError: false, loaded: false };
            this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState_1 } }); // Update store with new state
            this.cache[url] = this.httpSvc.get(url)
                .share()
                .map(function (res) {
                //Set status to success
                newState_1 = { loading: false, loadError: false, loaded: true };
                _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState_1 } }); // Update store with new state
                var data = apiMap.map ? apiMap.map(res) : res;
                _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.GET_COMPLETE, payload: { apiMap: apiMap, data: data } }); // Load content into store
                return data;
            })["catch"](function (error) {
                if (error.status == 401 || error.status == 403) {
                    error.errorMsg = 'Please log in ';
                    return _this.endSession(error);
                }
                else {
                    newState_1 = { loading: false, loadError: error, loaded: false };
                    _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState_1 } }); // Update store with new state
                    return rxjs_1.Observable["throw"](error);
                }
            });
            return this.cache[url];
        }
        else {
            return rxjs_1.Observable.of(true);
        }
        //return this.cache[url];
    };
    /**
    * Make a POST request and load the results into the store
    * @param url - The URL location of the endpoint
    * @param id - The location to put the results in the store
    * @param data - The data to pass to the server
    */
    ApiHttpService.prototype.postStore = function (url, apiMap, data) {
        var _this = this;
        // Set status to modifying
        var newState = { modifying: true, modified: false, modifyError: false };
        this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } }); // Update store with new state
        return this.httpSvc.post(url, data)
            .map(function (res) {
            // Set status to complete
            var newState = { modifying: false, modified: true, modifyError: false };
            _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } }); // Update store with new state
            // Check if the response has a payload or not
            var dataNew = res ? res : data;
            _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.POST_COMPLETE, payload: { apiMap: apiMap, data: dataNew } }); // Load content into store
            return rxjs_1.Observable.of(res);
        })["catch"](function (error) {
            if (error.status == 401 || error.status == 403) {
                error.errorMsg = 'Please log in ';
                return _this.endSession(error);
            }
            else {
                error.errorMsg = 'Unable to create ' + apiMap.storeProperty;
                // Set status to error
                var newState_2 = { modifying: false, modified: false, modifyError: error };
                _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState_2 } }); // Update store with new state
                return rxjs_1.Observable["throw"](error);
            }
        });
    }; // end post
    /**
    * Make a PUT request
    * @param url - The URL location of the webapi
    * @param data - The data to pass to the server
    */
    ApiHttpService.prototype.putStore = function (url, apiMap, data) {
        var _this = this;
        //console.warn('Putting ', url, apiMap, data);
        // Set status to modifying
        var newState = { modifying: true, modified: false, modifyError: false };
        this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } }); // Update store with new state
        return this.httpSvc.put(url, data)
            .map(function (res) {
            // Set status to complete
            var newState = { modifying: false, modified: true, modifyError: false };
            _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } }); // Update store with new state
            // Check if the response has a payload or not, if not then this is an upSert
            var dataNew = res ? res : data;
            _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.PUT_COMPLETE, payload: { apiMap: apiMap, data: dataNew } }); // Load content into store
            return rxjs_1.Observable.of(res);
        })["catch"](function (error) {
            console.warn('PUT Error, handle 403 unauth errors here', error);
            if (error.status == 401 || error.status == 403) {
                error.errorMsg = 'Please log in ';
                return _this.endSession(error);
            }
            else {
                error.errorMsg = 'Unable to update ' + apiMap.storeProperty;
                // Set status to error
                var newState_3 = { modifying: false, modified: false, modifyError: error };
                _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState_3 } }); // Update store with new state
                return rxjs_1.Observable["throw"](error);
            }
        });
    }; // end put
    /**
    * Make a DELETE request
    * @param url - The URL location of the webapi
    * @param apiMap - The ApiMap object
    * @param element - The element or collection of elements being deleted
    */
    ApiHttpService.prototype.deleteStore = function (url, apiMap, element) {
        var _this = this;
        // Set status to modifying
        var newState = { modifying: true, modified: false, modifyError: false };
        this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } }); // Update store with new state
        // Delete doesn't natively support a body so this adds it in for deleting collections or other uncommon operations
        return this.httpSvc.request('delete', url, { body: element })
            .map(function (res) {
            // Set status to complete
            var newState = { modifying: false, modified: true, modifyError: false };
            _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } }); // Update store with new state
            _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.DELETE_COMPLETE, payload: { apiMap: apiMap, data: element } }); // Load content into store
            return rxjs_1.Observable.of(res);
        })["catch"](function (error) {
            console.warn('DELETE Error, handle 403 unauth errors here', error);
            if (error.status == 401 || error.status == 403) {
                error.errorMsg = 'Please log in ';
                return _this.endSession(error);
            }
            else {
                error.errorMsg = 'Unable to delete ' + apiMap.storeProperty;
                // Set status to error
                var newState_4 = { modifying: false, modified: false, modifyError: error };
                _this.storeSvc.dispatch({ type: api_actions_1.ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState_4 } }); // Update store with new state
                return rxjs_1.Observable["throw"](error);
            }
        });
    }; // end post
    /**
     * When an authentication check fails
     * @param error
     */
    ApiHttpService.prototype.endSession = function (error) {
        this.cache = {};
        window.localStorage.removeItem('token');
        window.sessionStorage.clear();
        this.routerSvc.navigate(['/login'], { queryParams: { session: 'expired' } });
        return rxjs_1.Observable["throw"](error);
    };
    ApiHttpService = __decorate([
        core_1.Injectable()
    ], ApiHttpService);
    return ApiHttpService;
}());
exports.ApiHttpService = ApiHttpService;
