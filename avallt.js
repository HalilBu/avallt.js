(function() {
    window.avalltJS = {};
    var addFn = function(fnName, fn) {
        window.avalltJS[fnName] = fn;
    }

    /**
     * Determines whether the passed value is an array
     *
     * @param  {Object} value   the object to be checked
     * @return {boolean}        true, if value is an array
     */
    var isArray = function(value) {
        return toString.call(value) === '[object Array]';
    }
    addFn('isArray', isArray);

    /**
     * Determines whether the passed value is an object
     *
     * @param  {Object} value   the object to be checked
     * @return {boolean}        true, if value is an object
     */
    var isObject = function(value) {
        return toString.call(value) === '[object Object]';
    };
    addFn('isObject', isObject);

    /**
     * Determines whether the passed value is a string
     *
     * @param  {Object} term  the object to be checked
     * @return {boolean}      true, if passed value is a string
     */
    var isString = function(term) {
        return (typeof term === 'string');
    };
    addFn('isString', isString);

    /**
     * Determines whether the term contains the given text
     *
     * @param  {String} term
     * @param  {String} substr
     * @return {boolean}       true, if term contains given text
     */
    var stringContains = function(term, substr) {
        if (isString(term) && isString(substr)) {
            return term.indexOf(substr) >= 0;
        } else {
            return false;
        }
    };
    addFn('stringContains', stringContains);

    /*******************************************************************/

    /**
     * Analyses the diff between given objects
     *
     * @param  {Object} objectL
     * @param  {Object} objectR
     * @return {Object} calculated diff information about the given objects
     */
    var diff = function(objectL, objectR) {
        var propertiesOfLeft = [],
            propertiesOfRight = [],
            missingPropertiesLeft = [],
            missingPropertiesRight = [],
            valuesDiff = [];

        for (var property in objectL) {
            if (objectL.hasOwnProperty(property)) {
                propertiesOfLeft.push(property);
            }
        }

        for (var property in objectR) {
            if (objectR.hasOwnProperty(property)) {
                propertiesOfRight.push(property);
            }
        }
        var propertyExistsInList = function(property, list) {
            for (var j = 0; j < list.length; j++) {
                if (property === list[j]) {
                    return true;
                }
            }
            return false;
        }

        for (var i = 0; i < propertiesOfLeft.length; i++) {
            var property = propertiesOfLeft[i];

            if (propertyExistsInList(property, propertiesOfRight) === false) {
                missingPropertiesLeft.push(property);
            }
        }

        for (var i = 0; i < propertiesOfRight.length; i++) {
            var property = propertiesOfRight[i];

            if (propertyExistsInList(property, propertiesOfLeft) === false) {
                missingPropertiesRight.push(property);
            } else {
                valuesDiff.push({
                    property: property,
                    left: objectL[property],
                    right: objectR[property]
                });
            }
        }

        return {
            propsLeft: propertiesOfLeft,
            propsRight: propertiesOfRight,
            missingPropsLeft: missingPropertiesLeft,
            missingPropsRight: missingPropertiesRight,
            valuesDiff: valuesDiff
        }
    }
    addFn('diff', diff);

    /*******************************************************************/

    var _handleObjectProperty = function(item, property) {
        if (isObject(item)) {
            removeNestedProperty(item, property);
        } else if (isArray(item)) {
            for (var i = 0; i < item.length; i++) {
                removeNestedProperty(item[i], property);
            }
        }
    }

    /**
     * Frees the source object from given property. It also detects and removes
     * the given property in nested objects.
     *
     * @param  {Object} obj      source object
     * @param  {String} property property to remove
     * @return {Object}          object, which is freed from given property
     */
    var removeNestedProperty = function(obj, property) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (prop === property) {
                    delete obj[prop];
                } else {
                    _handleObjectProperty(obj[prop], property);
                }
            }
        }
        return obj;
    }
    addFn('removeNestedProperty', removeNestedProperty);

    /*******************************************************************/

    /**
     * Searches the given term in the object and returns an object
     * which contains the result of the search
     *
     * @param  {Object} obj        the object to search
     * @param  {String} searchTerm the search term
     * @return {Object}            result object
     */
    var searchInObj = function(obj, searchTerm) {
        var resultObj = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (prop.indexOf(searchTerm) >= 0) {
                    resultObj[prop] = obj[prop];
                }
                if (isString(obj[prop]) && stringContains(obj[prop], searchTerm)) {
                    resultObj[prop] = obj[prop];
                }
                if (isArray(obj[prop])) {
                    var resultFromArray = [];
                    for (var i = 0; i < obj[prop].length; i++) {
                        if (isString(obj[prop][i]) && stringContains(obj[prop][i], searchTerm)) {
                            resultFromArray.push(obj[prop][i]);
                            continue;
                        }
                        var tempResult = searchInObj(obj[prop][i], searchTerm);

                        if (JSON.stringify(tempResult) !== JSON.stringify({})) {
                            resultFromArray.push(tempResult);
                        }
                    }
                    if (resultFromArray.length > 0) {
                        resultObj[prop] = resultFromArray;
                    }
                }
            }
        }
        return resultObj;
    }
    addFn('searchInObj', searchInObj);
    /*******************************************************************/

    var mergeObjects = function(obj1, obj2) {
        var resultObj = {};

        for(var prop in obj2){
            if(obj2.hasOwnProperty(prop)){
                resultObj[prop] = obj2[prop];
            }
        }

        for(var prop in obj1){
            if(obj1.hasOwnProperty(prop)){
                resultObj[prop] = obj1[prop];
            }
        }

        return resultObj;
    }
    addFn('mergeObjects', mergeObjects);
})()
