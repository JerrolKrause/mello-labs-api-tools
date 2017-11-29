"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var api_actions_1 = require("./api.actions");
function ApiReducer(state, _a) {
    //console.log('STORE REDUCER:', type, payload);
    if (state === void 0) { state = {}; }
    var type = _a.type, payload = _a.payload;
    var srcData;
    switch (type) {
        // Reset State
        case api_actions_1.ApiActions.RESET:
            return {};
        // Get response
        case api_actions_1.ApiActions.GET_COMPLETE:
            // If response is an array
            if (Array.isArray(payload.data)) {
                state[payload.apiMap.storeProperty] = payload.data.slice();
            }
            else if (typeof payload.data == 'object') {
                state[payload.apiMap.storeProperty] = __assign({}, payload.data);
            }
            else if (typeof payload.data == 'string') {
                state[payload.apiMap.storeProperty][payload.apiMap.data] = payload.data;
            }
            else {
                console.error('GET_COMPLETE was not an object/array/string, please write a condition for this in the api.reducer', type, payload);
            }
            break;
        // Post response
        case api_actions_1.ApiActions.POST_COMPLETE:
            // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property. Otherwise just get data straight out of the store
            srcData = (payload.apiMap.map && payload.apiMap.mapSrc) ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc] : state[payload.apiMap.storeProperty];
            // If destination is an array and response is an array, concat with new data up front
            if (Array.isArray(srcData) && Array.isArray(payload.data)) {
                srcData = payload.data.concat(srcData);
            }
            else if (srcData && typeof payload.data === 'object') {
                /* TODO: Figure out how to do upserts. Maybe pass an additional prop
                if (payload.data[payload.apiMap.uniqueId]) {

                } else {
                    srcData = [payload.data, ...srcData];
                }
                */
                srcData = [payload.data].concat(srcData);
            }
            else if (typeof srcData === 'object' && typeof payload.data === 'object') {
                srcData = __assign({}, payload.data);
            }
            else {
                console.error('POST_COMPLETE was not an object or an array, please write a condition for this in the api.reducer');
            }
            // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
            state[payload.apiMap.storeProperty] = (payload.apiMap.map && payload.apiMap.mapSrc) ? payload.apiMap.map(srcData) : srcData;
            break;
        // PUT response
        case api_actions_1.ApiActions.PUT_COMPLETE:
            //console.warn('PUT_COMPLETE', payload)
            // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property. Otherwise just get data straight out of the store
            srcData = (payload.apiMap.map && payload.apiMap.mapSrc) ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc] : state[payload.apiMap.storeProperty];
            // If destination is an array and response is an array, loop through the destination array and update all entries with the new ones
            if (Array.isArray(srcData) && Array.isArray(payload.data)) {
                //console.warn('Array into array')
                for (var i = 0; i < payload.data.length; i++) {
                    for (var j = 0; j < srcData.length; j++) {
                        if (payload.data[i][payload.apiMap.uniqueId] == srcData[j][payload.apiMap.uniqueId]) {
                            srcData[j] = payload.data[i];
                            srcData = srcData.slice();
                            j = srcData.length + 1; // Cheap way to break the second for loop
                        }
                    }
                }
            }
            else if (Array.isArray(srcData) && typeof payload.data === 'object') {
                //console.warn('Object into array')
                // Loop through the destination array and when the unique ID is found, update the entry
                for (var i = 0; i < srcData.length; i++) {
                    if (srcData[i][payload.apiMap.uniqueId] == payload.data[payload.apiMap.uniqueId]) {
                        srcData[i] = payload.data;
                        srcData = srcData.slice();
                        break;
                    }
                }
            }
            else if (typeof srcData === 'object' && typeof payload.data === 'object') {
                //console.warn('Replace object')
                srcData = __assign({}, payload.data);
            }
            else {
                console.error('PUT_COMPLETE was not an object or an array, please write a condition for this in the api.reducer');
            }
            // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
            state[payload.apiMap.storeProperty] = (payload.apiMap.map && payload.apiMap.mapSrc) ? payload.apiMap.map(srcData) : srcData;
            break;
        // Delete response
        case api_actions_1.ApiActions.DELETE_COMPLETE:
            //console.warn('Delete Reducer ', payload)
            // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property. Otherwise just get data straight out of the store
            srcData = (payload.apiMap.map && payload.apiMap.mapSrc) ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc] : state[payload.apiMap.storeProperty];
            // If destination is an array and response is an array, loop through the destination array and update all entries with the new ones
            if (Array.isArray(srcData) && Array.isArray(payload.data)) {
                //console.warn('Delete array from array')
                for (var i = 0; i < payload.data.length; i++) {
                    for (var j = 0; j < srcData.length; j++) {
                        //console.warn('Looping 2', payload.data[i][payload.apiMap.uniqueId], srcData[j][payload.apiMap.uniqueId]);
                        if (payload.data[i][payload.apiMap.uniqueId] == srcData[j][payload.apiMap.uniqueId]) {
                            srcData.splice(j, 1);
                            srcData = srcData.slice();
                            j = srcData.length + 1; // Cheap way to break the second for loop
                        }
                    }
                }
            }
            else if (Array.isArray(srcData)) {
                // If this delete operation only has a single unique ID
                if (typeof payload.apiMap.uniqueId == 'string') {
                    srcData = srcData.filter(function (element) { return element[payload.apiMap.uniqueId] != payload.data[payload.apiMap.uniqueId]; });
                }
                else if (payload.apiMap.uniqueId.length) {
                    srcData = srcData.filter(function (element, index) {
                        // Loop through the uniqueID's list. If the number of unique ID's match what is in the API Map then relete it
                        var hasMatches = 0;
                        payload.apiMap.uniqueId.forEach(function (id) {
                            if (element[id] == payload.data[id]) {
                                hasMatches++;
                            }
                        });
                        return hasMatches != payload.apiMap.uniqueId.length ? true : false;
                    });
                }
            }
            else if (typeof srcData === 'object' && typeof payload.data === 'object') {
                delete srcData[payload.data];
            }
            else {
                console.error('DELETE_COMPLETE was not an object or an array, please write a condition for this in the api.reducer');
            }
            // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
            state[payload.apiMap.storeProperty] = (payload.apiMap.map && payload.apiMap.mapSrc) ? payload.apiMap.map(srcData) : srcData;
            break;
    }
    return state;
}
exports.ApiReducer = ApiReducer;
