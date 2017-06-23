// init system angular application

var app = angular.module('myApp', ['moment-picker', 'angular.filter']);

// set app filter for pagination
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});