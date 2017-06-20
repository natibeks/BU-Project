app.config(function ($routeProvider) {
    $routeProvider.when('/Home', {
        templateUrl: "inc/home.html",
        controller: "MovieController",
        resolve: {
            data: function (DataService) {
                return DataService.getAllData();
            }
        }
    })
    .when('Movies', {
        templateUrl: "inc/table.html",
        controller: "TableController",
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
        controller: "AdminController",
    })
    .otherwise({ redirectTo: '/Home' });
});