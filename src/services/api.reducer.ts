import { ApiStatusActions } from './api.actions';
import { ApiUtils } from '../utils/api-utils';

export function ApiReducer(state: { [key: string]: any } = {}, { type, payload }: any) {
  
  let srcData;

  switch (type) {
    // Reset State
    case ApiStatusActions.RESET:
      return {};

    // GET
    case ApiStatusActions.GET_COMPLETE:
      // If response is an array
      if (Array.isArray(payload.data)) {
        state[payload.apiMap.storeProperty] = [...payload.data];
      } else if (typeof payload.data === 'object') {
        // If response is an object
        state[payload.apiMap.storeProperty] = { ...payload.data };
      } else if (typeof payload.data === 'string') {
        // If response is an string, create/load into dictionary
        state[payload.apiMap.storeProperty][payload.apiMap.data] = payload.data;
      }
      break;

    // UPSERT
    case ApiStatusActions.UPSERT_COMPLETE:
      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      //      Otherwise just get data straight out of the store
      srcData = payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc]
        : state[payload.apiMap.storeProperty];

      // Perform UPSERT
      srcData = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'upsert');

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] = payload.apiMap.map &&
        payload.apiMap.mapSrc
        ? payload.apiMap.map(srcData)
        : srcData;
      break;

    // POST
    case ApiStatusActions.POST_COMPLETE:
      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      //  Otherwise just get data straight out of the store
      srcData = payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc]
        : state[payload.apiMap.storeProperty];

      // If destination is an array and response is an array, concat with new data up front
      if (Array.isArray(srcData) && Array.isArray(payload.data)) {
        srcData = [...payload.data, ...srcData];
      } else if (srcData && typeof payload.data === 'object') {
        // If destination is an array and response is an object, push with new data up front
        srcData = [payload.data, ...srcData];
      } else if (
        typeof srcData === 'object' &&
        typeof payload.data === 'object'
      ) {
        // If destination is an object and response is an object, replace current instance
        srcData = { ...payload.data };
      }

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] = payload.apiMap.map &&
        payload.apiMap.mapSrc
        ? payload.apiMap.map(srcData)
        : srcData;
      break;

    // PUT
    case ApiStatusActions.PUT_COMPLETE:
      // console.warn('PUT_COMPLETE', payload)

      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      // Otherwise just get data straight out of the store
      srcData = payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc]
        : state[payload.apiMap.storeProperty];

      // Perform REPLACE
      srcData = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'replace');

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] = payload.apiMap.map &&
        payload.apiMap.mapSrc
        ? payload.apiMap.map(srcData)
        : srcData;
      break;

    // DELETE
    case ApiStatusActions.DELETE_COMPLETE:
      // console.warn('Delete Reducer ', payload)

      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      // Otherwise just get data straight out of the store
      srcData = payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc]
        : state[payload.apiMap.storeProperty];

      // Perform DELETE
      srcData = ApiUtils.updateRecords(srcData, payload.data, payload.apiMap.uniqueId, 'delete');

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] = payload.apiMap.map &&
        payload.apiMap.mapSrc
        ? payload.apiMap.map(srcData)
        : srcData;
      break;
  }

  return state;
}
