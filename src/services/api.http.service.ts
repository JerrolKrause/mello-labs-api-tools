import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
// TODo: Migrate to letterable operators
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ApiActions } from './api.actions'

@Injectable()
export class ApiHttpService {
    /** Hold GET requests from an API using the URL as a primary key */
	protected cache: { [key: string]: Observable<any> } = {};
  
    constructor(
		private httpSvc: HttpClient,
        private storeSvc: Store<IStore.root>,
		private routerSvc: Router,
	) {
		
    }

    /**
    * Make a GET request with simple caching
    * @param url - The URL location of the webapi
    * @param updateCache - Refresh the version in the cache
    */
    public get<T>(url: string, updateCache: boolean = false): Observable<T> {
        // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
        if (!this.cache[url] || updateCache) {
	        this.cache[url] = this.httpSvc.get(url)
				.share()
        }
        return this.cache[url];
    } // end get

    /**
    * Make a GET request and load the results into the store
    * @param url - The URL location of the webapi
    * @param id - The location to put the results in the store
    * @param updateCache - Refresh the version in the cache
    */
    protected getStore<T>(url: string, apiMap?: IStore.ApiMap, updateCache: boolean = false): Observable<T> {
        // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
        if (this.cache[url] == null || updateCache) {
	        // Set status to waiting
	        let newState: IStore.ApiStatus = { loading: true, loadError: false, loaded: false };
	        this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
	        this.cache[url] = this.httpSvc.get(url)
		        .share()
		        .map(res => {
			        //Set status to success
			        newState = { loading: false, loadError: false, loaded: true };
			        this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
			        let data = apiMap.map ? apiMap.map(res) : res;
			        this.storeSvc.dispatch({ type: ApiActions.GET_COMPLETE, payload: { apiMap: apiMap, data: data } });// Load content into store
			        return data;
				})
				.catch(error => {
			        if (error.status == 401 || error.status == 403) {
				        error.errorMsg = 'Please log in ';
				        return this.endSession(error);
			        } else {
				        newState = { loading: false, loadError: error, loaded: false };
				        this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
						return Observable.of(error);
			        }
		        });
		        return this.cache[url];
        } else {
		        return Observable.of(<any>true);
        }
		
        //return this.cache[url];
    } 

    /**
    * Make a POST request and load the results into the store
    * @param url - The URL location of the endpoint
    * @param id - The location to put the results in the store
    * @param data - The data to pass to the server
    */
    protected postStore<T>(url: string, apiMap: IStore.ApiMap, data: any): Observable<T> {
        // Set status to modifying
    let newState: IStore.ApiStatus = { modifying: true, modified : false, modifyError: false };
	    this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
	    return this.httpSvc.post(url, data)
		    .map(res => {
				    // Set status to complete
				    let newState: IStore.ApiStatus = { modifying: false, modified: true, modifyError: false };
				    this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
                    // Check if the response has a payload or not
				    let dataNew = res ? res : data;
				    this.storeSvc.dispatch({ type: ApiActions.POST_COMPLETE, payload: { apiMap: apiMap, data: dataNew } });// Load content into store
				    return Observable.of(res);
			})
			.catch(error => {
				    if (error.status == 401 || error.status == 403) {
					    error.errorMsg = 'Please log in ';
					    return this.endSession(error);
				    } else {
					    error.errorMsg = 'Unable to create ' + apiMap.storeProperty;
					    // Set status to error
					    let newState: IStore.ApiStatus = { modifying: false, modified: false, modifyError: error };
					    this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
						return Observable.of(error);
				    }
		    });
    } // end post

    /**
    * Make a PUT request
    * @param url - The URL location of the webapi
    * @param data - The data to pass to the server
    */
    protected putStore<T>(url: string, apiMap: IStore.ApiMap, data: any): Observable<T> {
	    //console.warn('Putting ', url, apiMap, data);
	    // Set status to modifying
	    let newState: IStore.ApiStatus = { modifying: true, modified: false, modifyError: false };
	    this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
	    return this.httpSvc.put(url, data)
		    .map(res => {
			    // Set status to complete
			    let newState: IStore.ApiStatus = { modifying: false, modified: true, modifyError: false };
			    this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
			    // Check if the response has a payload or not, if not then this is an upSert
			    let dataNew = res ? res : data;
			    this.storeSvc.dispatch({ type: ApiActions.PUT_COMPLETE, payload: { apiMap: apiMap, data: dataNew } });// Load content into store
			    return Observable.of(res);
			})
			.catch(error => {
			    console.warn('PUT Error, handle 403 unauth errors here', error);

			    if (error.status == 401 || error.status == 403) {
				    error.errorMsg = 'Please log in ';
				    return this.endSession(error);
			    } else {
				    error.errorMsg = 'Unable to update ' + apiMap.storeProperty;
				    // Set status to error
				    let newState: IStore.ApiStatus = { modifying: false, modified: false, modifyError: error };
				    this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
					return Observable.of(error);
			    }
		    });
    } // end put

    /**
    * Make a DELETE request
    * @param url - The URL location of the webapi
    * @param apiMap - The ApiMap object
    * @param element - The element or collection of elements being deleted
    */
    protected deleteStore<T>(url: string, apiMap: IStore.ApiMap, element:any | any[]): Observable<T> {
	    // Set status to modifying
	    let newState: IStore.ApiStatus = { modifying: true, modified: false, modifyError: false };
		this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state

    // Delete doesn't natively support a body so this adds it in for deleting collections or other uncommon operations
    return this.httpSvc.request('delete', url, { body: element })
    //return this.httpSvc.delete(url, , { body: element }) // Does not work with body, add back in when it does
	    .map(res => {
		    // Set status to complete
		    let newState: IStore.ApiStatus = { modifying: false, modified: true, modifyError: false };
		    this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
		    this.storeSvc.dispatch({ type: ApiActions.DELETE_COMPLETE, payload: { apiMap: apiMap, data: element } });// Load content into store
		    return Observable.of(res);
		})
		.catch(error => {
		    console.warn('DELETE Error, handle 403 unauth errors here', error);
		    if (error.status == 401 || error.status == 403) {
			    error.errorMsg = 'Please log in ';
			    return this.endSession(error);
		    } else {
			    error.errorMsg = 'Unable to delete ' + apiMap.storeProperty;
			    // Set status to error
			    let newState: IStore.ApiStatus = { modifying: false, modified: false, modifyError: error };
			    this.storeSvc.dispatch({ type: ApiActions.STATE_CHANGE, payload: { apiMap: apiMap, newState: newState } });// Update store with new state
				return Observable.of(error);
		    }
	    });
    } // end post

    /**
     * When an authentication check fails
     * @param error
     */
	  private endSession(error:any) {
		    this.cache = {};
		    window.localStorage.removeItem('token');
		    window.sessionStorage.clear();
			this.routerSvc.navigate(['/login'], { queryParams: { session: 'expired' } });
		    return Observable.of(error);
	  }
}

export declare namespace IStore {
    /*************************
    * App specific interfaces
    *************************/

	/** API Store */
	interface api {
		//users?: any[]; // Store response
		// Example of Store typing with mapped response
		users?: Mapped<{
			user: string;
			email: string;
			name: string;
			phone: string;
			username: string;
			website: string;
		}>;
	}

	/** The API Map */
	export interface ApiMapping {
		users?: ApiMap;
	}

	/** UI Store */
	interface ui {
		modal?: {
			modalId: string;
			options: {};
			data: any;
		};
	}


    /*************************
    * Non-customizable interfaces
    *************************/

	/** The root store which contains the other stores */
	interface root {
		api?: api;
		ui?: ui;
		apiStatus?: apiStatus;
	}

	/** API status store */
	interface apiStatus {
		[key: string]: ApiStatus;
	}

	/** Example pattern for data that is mapped before being passed into the store */
	interface Mapped<T> {
		/** Unaltered source of API response */
		src?: T[];
		/** A dictionary organized by the primary key */
		dict?: { [key: string]: T };
		/** A deduped array arranged into a dictionary by primary key */
		uniques?: { [key: string]: T };
	}

	interface StateStatuses {
		// Example
		users?: ApiStatus;
	}

	interface ApiStatus {
		loading?: boolean;
		loaded?: boolean;
		loadError?: any;

		modifying?: boolean;
		modified?: boolean;
		modifyError?: any;
	}

	/** Maps the relationship between the store and the API. Automates all the interaction. */
	export interface ApiMap {
		/** The location of the rest API endpoint */
		endpoint?: string;
		/** The location/property of where to put the API response into the store */
		storeProperty?: string;
		/** A unique ID of each object in the collection. Also supports an array of strings if multiple unique ID's are needed in the event of a single key not being enough. */
		uniqueId?: string | string[];
		/** A callback function to modify the API response before it is inserted into the store */
		map?: any;
		/** If a map callback function is specified, this is the key for the location of the original unfiltered list of items. This is necessary to update the mapped list in the store without a GET all */
		mapSrc?: string;
		/** Occasionally a unique piece of information needs to be passed to the reducer from the method.  This property can have data assigned to pass to the reducer */
		data?: any;
	}

	interface Rest {
		storeProp: string;
		path: string;
	}
}
