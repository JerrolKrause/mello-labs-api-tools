import { ApiStatusActions } from './api.actions';

export function ApiReducer(state: any = {}, { type, payload }: any) {
  // console.log('STORE REDUCER:', type, payload);

  let srcData;

  switch (type) {
    // Reset State
    case ApiStatusActions.RESET:
      return {};

    // Get response
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
      } else {
        console.error(
          'GET_COMPLETE was not an object/array/string, please write a condition for this in the api.reducer',
          type,
          payload
        );
      }
      break;

    // Upsert
    case ApiStatusActions.UPSERT_COMPLETE:
      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      //      Otherwise just get data straight out of the store
      srcData = payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc]
        : state[payload.apiMap.storeProperty];

      let existingRecord = false;
      // Verify that the current src is an array
      if (Array.isArray(srcData)) {
        // Loop through the API response and determine if a record with a matching primary key is found
        for (let i = 0; i < srcData.length; i++) {
          // console.log(payload.data[payload.apiMap.uniqueId], srcData[i][payload.apiMap.uniqueId]);
          // If the unique ID matches a current item
          if (
            payload.data[payload.apiMap.uniqueId] ===
            srcData[i][payload.apiMap.uniqueId]
          ) {
            // Replace the current record
            srcData[i] = { ...payload.data };
            existingRecord = true; // Set flag so insert is bypassed
            break; // Stop loop
          }
        }
        // If no existing record found, append to front of array
        if (!existingRecord) {
          srcData = [payload.data, ...srcData];
        }
      } else {
        console.error(
          'UPSERT_COMPLETE was not an array, please write a condition for this in the api.reducer'
        );
      }

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] = payload.apiMap.map &&
        payload.apiMap.mapSrc
        ? payload.apiMap.map(srcData)
        : srcData;
      break;

    // Post response
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
      } else {
        console.error(
          'POST_COMPLETE was not an object or an array, please write a condition for this in the api.reducer'
        );
      }

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] = payload.apiMap.map &&
        payload.apiMap.mapSrc
        ? payload.apiMap.map(srcData)
        : srcData;
      break;

    // PUT response
    case ApiStatusActions.PUT_COMPLETE:
      // console.warn('PUT_COMPLETE', payload)

      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      // Otherwise just get data straight out of the store
      srcData = payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc]
        : state[payload.apiMap.storeProperty];

      // If destination is an array and response is an array, loop through the destination array and update all entries with the new ones
      if (Array.isArray(srcData) && Array.isArray(payload.data)) {
        // console.warn('Array into array')
        for (let i = 0; i < payload.data.length; i++) {
          // Loop through payload
          for (let j = 0; j < srcData.length; j++) {
            // Loop through response object
            if (
              payload.data[i][payload.apiMap.uniqueId] ===
              srcData[j][payload.apiMap.uniqueId]
            ) {
              srcData[j] = payload.data[i];
              srcData = [...srcData];
              j = srcData.length + 1; // Cheap way to break the second for loop
            }
          }
        }
      } else if (Array.isArray(srcData) && typeof payload.data === 'object') {
        // If destination is an array and response is an object, loop through the array and replace the instance base on the primary key
        // console.warn('Object into array')
        // Loop through the destination array and when the unique ID is found, update the entry
        for (let i = 0; i < srcData.length; i++) {
          if (
            srcData[i][payload.apiMap.uniqueId] ===
            payload.data[payload.apiMap.uniqueId]
          ) {
            srcData[i] = payload.data;
            srcData = [...srcData];
            break;
          }
        }
      } else if (
        typeof srcData === 'object' &&
        typeof payload.data === 'object'
      ) {
        // If destination is an object and response is an object, replace current instance
        // console.warn('Replace object')
        srcData = { ...payload.data };
      } else {
        console.error(
          'PUT_COMPLETE was not an object or an array, please write a condition for this in the api.reducer'
        );
      }

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] = payload.apiMap.map &&
        payload.apiMap.mapSrc
        ? payload.apiMap.map(srcData)
        : srcData;
      break;

    // Delete response
    case ApiStatusActions.DELETE_COMPLETE:
      // console.warn('Delete Reducer ', payload)

      // If a map and mapSrc element are present, grab the unfiltered content from the mapSrc property.
      // Otherwise just get data straight out of the store
      srcData = payload.apiMap.map && payload.apiMap.mapSrc
        ? state[payload.apiMap.storeProperty][payload.apiMap.mapSrc]
        : state[payload.apiMap.storeProperty];

      // If destination is an array and response is an array, loop through the destination array and update all entries with the new ones
      if (Array.isArray(srcData) && Array.isArray(payload.data)) {
        // console.warn('Delete array from array')
        for (let i = 0; i < payload.data.length; i++) {
          // Loop through payload
          for (let j = 0; j < srcData.length; j++) {
            // Loop through response object
            // console.warn('Looping 2', payload.data[i][payload.apiMap.uniqueId], srcData[j][payload.apiMap.uniqueId]);
            if (
              payload.data[i][payload.apiMap.uniqueId] ===
              srcData[j][payload.apiMap.uniqueId]
            ) {
              srcData.splice(j, 1);
              srcData = [...srcData];
              j = srcData.length + 1; // Cheap way to break the second for loop
            }
          }
        }
      } else if (Array.isArray(srcData)) {
        // If destination is an array, loop through the array and replace the instance base on the unique ID
        // If this delete operation only has a single unique ID
        if (typeof payload.apiMap.uniqueId === 'string') {
          srcData = srcData.filter(
            element =>
              element[payload.apiMap.uniqueId] !==
              payload.data[payload.apiMap.uniqueId]
          );
        } else if (payload.apiMap.uniqueId.length) {
          // If this delete operation has multiple unique ID's. This is for a rare case where a collection has records with a lot of shared data.
          srcData = srcData.filter(element => {
            // Loop through the uniqueID's list. If the number of unique ID's match what is in the API Map then relete it
            let hasMatches = 0;
            payload.apiMap.uniqueId.forEach((id: any) => {
              if (element[id] === payload.data[id]) {
                hasMatches++;
              }
            });
            return hasMatches !== payload.apiMap.uniqueId.length ? true : false;
          });
        }
      } else if (
        typeof srcData === 'object' &&
        typeof payload.data === 'object'
      ) {
        // If destination is an object, delete the property from within the object
        delete srcData[payload.data];
      } else {
        console.error(
          'DELETE_COMPLETE was not an object or an array, please write a condition for this in the api.reducer'
        );
      }

      // If map and mapSrc are present, remap the data before returning it to the store, otherwise just return the store data
      state[payload.apiMap.storeProperty] = payload.apiMap.map &&
        payload.apiMap.mapSrc
        ? payload.apiMap.map(srcData)
        : srcData;
      break;
  }

  return state;
}
