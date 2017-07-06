app.config(function ($routeProvider) {
    $routeProvider.when('/Home', {
        templateUrl: "inc/home.html",
        controller: "HomeController",
        resolve: {
            data: function (DataService) {
                return DataService.getData();
            }

        }
    })
    .when('/Movies', {
        templateUrl: "inc/home.html",
        controller: "TableController",
        resolve: {
            data: function (DataService) {
                return DataService.getData();
            }
        }
    })
    .when('/Login', {
        templateUrl: "inc/login.html",
        controller: "LoginController"
    })
    .when('/Logout', {
        controller: "LoginController",
        resolve: {
            tologout: function (AuthService) {
                return AuthService.logout();
            }
        }
    })
    .otherwise({ redirectTo: '/Login' });
});