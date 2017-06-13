
app.controller('forgotPassController', function ($scope, $http) {
    $scope.sendPasswordToEmail = function (valid) {
        if (valid) {
            var url = 'Tasks.aspx?tp=ForgotPassword';
            $http.get(url + "&user=" + $scope.userName).then(
                function (d) {
                    $scope.opSucceed = true;
                },
                function (err) {

                })
        }

    }

    $scope.backToLogin = function () {
        window.location.href = "Login.aspx";
    }

});