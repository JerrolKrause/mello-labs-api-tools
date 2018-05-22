/**
 * Helper utilities for desktop interaction
 */
export class ApiUtils {
  /**
  * Replace/upsert/delete objects in an array
  * @param srcArray A source array which will be updated by objects from the records argument
  * @param records Objects to replace/delete/add to the source array
  * @param uniqueID The primary key or unique identifier for the objects in the array
  * @param operation The type of operation to perform
    replace: Update existing objects if found
    upsert: Update existing objects if found, add unfound objects to beginning of array
    delete: Remove found objects from the array
  */
  public static updateRecords<T>(
    srcArray: T[],
    records: T | T[],
    uniqueID: string | string[],
    operation: 'replace' | 'upsert' | 'delete',
  ): T[] {
    // If unique ID is a string, drop it into an array so a single method can be used to iterate
    const uniqueIDNew = typeof uniqueID === 'string' ? [uniqueID] : uniqueID;
    // If newrecords is an object, drop it into an array so a single method can be used to iterate
    const recordsNew = Array.isArray(records) ? records : [records];

    // Map new records down to a dictionary for easy reference without a nested for loop
    const dict: { [key: string]: T } = {};
    recordsNew.forEach((record: any) => {
      // Create a key that is the result of one or more unique identifiers supplied by uniqueID arg
      const recordId = uniqueIDNew.reduce((a, b) => a + record[b], '');
      dict[recordId] = record;
    });

    // Keep track of how many records have been replaced. Break loop when done
    let matches = 0;
    // Keep track if any records were updated
    let recordsUpdated = false;
    // Keep track of which indexes to delete for delete operation
    const indexesToDelete: number[] = [];

    // Loop through source array
    for (let i = 0; i < srcArray.length; i++) {
      // Create a key that is the result of one or more unique identifiers supplied by `uniqueID`
      const recordCurrentKey = uniqueIDNew.reduce((a, b) => a + (<any>srcArray)[i][b], '');

      // If the current record key is found in the dictionary, update the reference
      if (dict[recordCurrentKey]) {
        // If operation is upsert or replace
        if (operation === 'upsert' || operation === 'replace') {
          // Update record
          srcArray[i] = dict[recordCurrentKey];
          // Now delete out of dictionary to verify it has been updated
          delete dict[recordCurrentKey];
        } else if (operation === 'delete') {
          // If delete, push index to delete array
          indexesToDelete.push(i);
        }

        matches++;
        recordsUpdated = true;
      }

      // If all records have been updated, stop loop
      if (matches === uniqueIDNew.length + 1) {
        break;
      }
    }

    // UPSERT
    // If items are left over in the dictionary
    if (operation === 'upsert' && Object.keys(dict).length) {
      // Loop through all outstanding records and append to front of src array
      Object.keys(dict).forEach(key => srcArray.unshift(dict[key]));
      recordsUpdated = true;
      // DELETE
    } else if (operation === 'delete') {
      // If delete operation, remove found indexes from array
      indexesToDelete.forEach(num => srcArray.splice(num, 1));
    }

    // If records were updated, return new immutable instance. Otherwise return untouched srcArray
    return recordsUpdated ? Array.from(srcArray) : srcArray;
  } // End updateRecords
}
