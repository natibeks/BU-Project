// init system angular application

var app = angular.module('myApp', ['ngRoute', 'ngSanitize', 'ui.select']);

app.run(function ($rootScope,$location,AuthService) {

    $rootScope.$on('$locationChangeStart', function () {
        //if ($location.path() != "/Login" && $location.path() != "/Home" && $location.path()!="/Movies")
            if (AuthService.currentUser == null) {
                $location.path("/Login");
                return;
            }
            else
                $location.path("/Home");
    });
});

app.directive('preventDefault', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault();
                });
            }
        }
    };
});