(function() {
    window.avalltJS = {};
    var addFn = function(fnName, fn) {
        window.avalltJS[fnName] = fn;
    }

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
            missingPropertiesRight = [];

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
            }
        }

        return {
            propsLeft: propertiesOfLeft,
            propsRight: propertiesOfRight,
            missingPropsLeft: missingPropertiesLeft,
            missingPropsRight: missingPropertiesRight
        }
    }
    addFn('diff', diff);
})()
