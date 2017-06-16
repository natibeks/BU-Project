app.expandUserController = function ($scope, $http) {
    $scope.userTemplate = {
        Id: 0,
        DisplayName: "",
        EmailAddress: "a@b.com",
        TelephoneNumber: "",
        Department: "",
        Role: "",
        UserPassword: "",
        IsArchive: false
    }

    $scope.setUserWin = function (user) {
        if (user == undefined)
            $scope.selectedUser = angular.copy($scope.userTemplate);
        else
            $scope.selectedUser = angular.copy(user);
        $("#editUserModal").show();
    }

    $scope.updateUser = function () {
        var isNew = $scope.selectedUser.Id == 0;
        DataService.makePostRequest("Tasks.aspx?tp=updUser", $scope.selectedUser).then(
            function (response) {
                if (!response.RequestSucceed) return;
                var res = response.Data;
                if (isNew) {
                    $scope.selectedUser.Id = res.Id;
                    $scope.data.User.push($scope.selectedUser);
                }
                else {
                    angular.forEach($scope.data.User, function (i, o) {
                        if (o.Id == res.Id)
                            $scope.data.User[i] = angular.copy($scope.selectedUser);
                    })
                }

                $scope.error = false;
            })
    };

    $scope.deleteUser = function () {

    }

}