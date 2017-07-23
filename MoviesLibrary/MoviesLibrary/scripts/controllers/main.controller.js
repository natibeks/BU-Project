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

    $scope.setPage = function (page, newest) {
        $scope.popularPage = false;
        if (page == 1 && newest==true) {
            $scope.$broadcast('setNewestSelectedMovie');
            $scope.popularPage = true;
        }
        $scope.$broadcast('resetMode');
        $scope.currentPage = page;
    }

    $scope.logout = function () {
        AuthService.logout();
    }

    $scope.applySaftly = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});