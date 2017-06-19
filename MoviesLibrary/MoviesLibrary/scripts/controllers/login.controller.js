app.controller('LoginController', function ($scope, AuthService, DataService) {
    $scope.loginFailed = false;
    $scope.forgotView = false;

    $scope.sendLogin = function (valid) {
        if (!valid) return;
        AuthService.login($scope.userInput).then(
            function (response) {
                if (response.Id > 0)
                    $scope.$emit('loginSucceed', response);
                else
                    $scope.loginFailed = true;
        })
    }

    $scope.sendPassword = function () {
        DataService.makeGetRequest("RequestsHandler.aspx?tp=login", { email: $scope.userInput.email }).then(function (response) {
            if (!response.RequestSucceed) return;
            if (response.Data == 'error')
                $scope.forgotSucceed = true;
            else
                $scope.forgotSucceed = false;

        })
    }


});