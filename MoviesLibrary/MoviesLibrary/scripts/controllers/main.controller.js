app.controller('MainController', function ($scope, $location,DataService,AuthService) {
    $scope.$on('loginSucceed', function (e,user) {
        $scope.currentUser = user;
        AuthService.setLoginStatus(true);
        $location.path("/Home");
    })

    $scope.setPage = function (page) {
        if (page==1) {
            var a = Enumerable.From($scope.data.Movie).Where(function (x) { return x.IsArchive != true && x.WhoRent > 0; }).ToArray();
            $scope.selectedMovie = angular.copy(a[a.length - 1]);
        }
        $scope.currentPage = page;
    }
});