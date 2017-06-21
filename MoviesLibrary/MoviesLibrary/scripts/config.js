app.config(function ($routeProvider) {
    $routeProvider.when('/Home', {
        templateUrl: "inc/home.html",
        controller: "HomeController",
        resolve: {
            data: function (DataService,AuthService) {
                var user = AuthService.currentUser;
                DataService.getAllData(user.Id,user.Admin).then(function(x){
                    return x;
                });
            }
        }
    })
    //.when('Movies', {
    //    templateUrl: "inc/table.html",
    //    controller: "TableController",
    //    resolve: {
    //        data: function (DataService) {
    //            return DataService.getData();
    //        }
    //    }
    //})
    .when('/Login', {
        templateUrl: "inc/login.html",
        controller: "LoginController",
        resolve: {
            data: function (DataService) {
                return DataService.loadingStatus;
            }
        }
    })
    //.when('AdminManagment', {
    //    templateUrl: "inc/adminman.html",
    //    controller: "AdminController",
    //})
    .otherwise({ redirectTo: '/Login' });
});