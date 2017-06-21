app.controller('LoginController', function ($scope, AuthService, DataService,data) {
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
        AuthService.login($scope.userInput).then(
            function (response) {
                if (response.Succeed)
                    $scope.$emit('loginSucceed', response.User);
                else
                    $scope.loginFailed = true;
        })
    }

    $scope.sendPassword = function () {
        DataService.makeGetRequest("RequestsHandler.aspx?tp=login", { userId: $scope.userInput.userId }).then(function (response) {
            if (!response.RequestSucceed) return;
            if (response.Data == 'error')
                $scope.forgotSucceed = true;
            else
                $scope.forgotSucceed = false;

        })
    }


});