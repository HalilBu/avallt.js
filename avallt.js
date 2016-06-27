(function() {
    window.avalltJS = {};
    var addFn = function(fnName, fn) {
        window.avalltJS[fnName] = fn;
    }
    var diff = function(object1, object2) {
        var propertiesOf1 = [],
            propertiesOf2 = [];

        for (var property in object1) {
            if (object1.hasOwnProperty(property)) {
                propertiesOf1.push(property);
            }
        }

        for (var property in object2) {
            if (object2.hasOwnProperty(property)) {
                propertiesOf2.push(property);
            }
        }
    }
})()
