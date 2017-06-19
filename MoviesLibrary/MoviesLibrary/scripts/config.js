app.config(function ($routeProvider) {
    $routeProvider.when('/Home', {
        templateUrl: "inc/home.html",
        controller: "HomeController",
        resolve: {
            data: function (DataService) {
                return DataService.getAll();
            }
        }
    })
    .when('Movies', {
        templateUrl: "inc/movies.html",
        controller: "HomeController",
        resolve: {
            data: function (DataService) {
                return DataService.getData();
            }
        }
    })
    .when('Login', {
        templateUrl: "inc/login.html",
        controller: "LoginController",
    })
    .when('AdminManagment', {
        templateUrl: "inc/adminman.html",
        controller: "HomeController",
    })
    .otherwise({ redirectTo: '/Home' });
});