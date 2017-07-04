app.controller('LoginController', function ($scope, $rootScope, AuthService, DataService) {
    $scope.loginFailed = false;
    $scope.forgotView = false;
    $scope.userInput = {
        userId: "",
        password: ""
    };

    $scope.setForgotView = function (flag) {
        $scope.userInput = {
            userId: "",
            password: ""
        };
        $scope.forgotView = flag;
    }

    $scope.sendLogin = function (valid) {
        if (!valid) return;
        $rootScope.loadingStatus = true;
        AuthService.login($scope.userInput).then(
            function (response) {
                if (response.Succeed)
                    $scope.$emit('loginSucceed', response.User);
                else {
                    $rootScope.loadingStatus = false;
                    $scope.loginFailed = true;
                }
                    
        })
    }

    $scope.sendPassword = function () {
        DataService.makeGetRequest("login", { userId: $scope.userInput.userId }).then(function (response) {
            if (!response.RequestSucceed) return;
            if (response.Data == 'error')
                $scope.forgotSucceed = true;
            else
                $scope.forgotSucceed = false;

        })
    }

    $scope.logout = function () {
        AuthService.logout();
    }

});