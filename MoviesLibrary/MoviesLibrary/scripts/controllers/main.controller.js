app.controller('MainController', function ($scope, $location,DataService) {
    $scope.$on('loginSucceed', function (user) {
        $scope.currentUser = user;
        $location("/Home");
    })
});