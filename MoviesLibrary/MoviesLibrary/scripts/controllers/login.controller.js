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

    $scope.setRegisterView = function (flag) {
        $scope.userInput = {
            userId: "",
            user_fname: "",
            user_lname: "",
            email: "",
            password: ""
        };
        $scope.registerView = flag;
    }

    $scope.sendRegister = function (valid) {
        if (!valid) return;
        $rootScope.loadingStatus = true;
        AuthService.register($scope.userInput).then(
            function (response) {
                if (response.Succeed) {
                    //open sucess modal and go to login
                    $("#successRegister").modal('show');
                    $rootScope.loadingStatus = false;
                }       
                else {
                    $rootScope.loadingStatus = false;
                    $scope.registerFailed = true;
                }

            })
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


});