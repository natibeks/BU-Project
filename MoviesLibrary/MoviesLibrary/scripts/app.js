// init system angular application

var app = angular.module('myApp', ['ngRoute']);

app.run(function ($rootScope,$location,AuthService) {

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        //if (current.originalPath != "Login" || current.originalPath != "ForgotPassword")
        //    if (AuthService.user == null) {
        //        $location.path("/Login");
        //        return;
        //    }
        //$location.path("/Login");
        $rootScope.currentRoute = current.originalPath;
        //console.log(current.originalPath);
    });
});