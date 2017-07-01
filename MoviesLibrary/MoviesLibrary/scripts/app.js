// init system angular application

var app = angular.module('myApp', ['ngRoute', 'ngSanitize', 'ui.select', 'ngFileUpload']);

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

