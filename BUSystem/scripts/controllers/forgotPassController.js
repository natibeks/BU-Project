
app.controller('forgotPassController', function ($scope, DataService) {
    $scope.isSucceed = false;
    $scope.userEmail;
    $scope.sendPasswordToEmail = function (valid) {
        if (valid) {
            $scope.userEmail = $('#userName').val();
            var url = 'Tasks.aspx?tp=ForgotPassword';
            DataService.makeGetRequest('Tasks.aspx?tp=ForgotPassword', { email: $scope.userEmail }).then(
                function (response) {
                    if (!response.RequestSucceed) return;
                    if (response.Data == 'error')
                        $scope.isFailed = true;
                    else
                        $scope.isSucceed = true;
            })

        }

    }

    $scope.backToLogin = function () {
        window.location.href = "Login.aspx";
    }

});