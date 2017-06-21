app.controller('MainController', function ($rootScope, $scope, $location, AuthService, DataService) {
    $scope.currentPage = 1;
    $rootScope.loadingStatus = false;
    $rootScope.loginStatus = false;
    $scope.$on('loginSucceed', function (e,user) {
        $scope.currentUser = user;
        DataService.getAllData(user.Id, user.Admin).then(function (x) {
            $rootScope.loginStatus = true;
            $location.path("/Home");
        })

    })

    $scope.setPage = function (page,newest) {
        if (page == 1 && newest) {
            $scope.$broadcast('setNewestSelectedMovie');
        }
        $scope.currentPage = page;
    }
});