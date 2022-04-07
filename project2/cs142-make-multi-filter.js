'use strict';

function cs142MakeMultiFilter(originalArray) {
    var currentArray = originalArray.slice();
    return function arrayFilterer(filterCriteria=0, callback=0) {
        if (!(filterCriteria instanceof Function)) {
            return currentArray;
        }
        for (let i = currentArray.length - 1; i >= 0; i--) {
            if (filterCriteria(currentArray[i]) === false) {
                currentArray.splice(i, 1);
            }
        }
        if (callback instanceof Function){
            callback.call(originalArray, currentArray);
        }
        return arrayFilterer;
    };
}