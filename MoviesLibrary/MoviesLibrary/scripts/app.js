// init system angular application

var app = angular.module('myApp', ['moment-picker', 'ngRoute']);

app.run(function ($rootScope,$location,AuthService) {

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        if (current.originalPath != "Login" || current.originalPath != "ForgotPassword")
            if (AuthService.user == null) {
                $location("/Login");
                return;
            }
        $rootScope.currentRoute = current.originalPath;
        //console.log(current.originalPath);
    });
});