app.expandUserController = function ($scope, DataService) {
    $scope.userTemplate = {
        Id: 0,
        DisplayName: "",
        EmailAddress: "",
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
        $("#editUserModal").modal('show');
    }

    $scope.updateUser = function () {
        if (!$scope.validUserForm()) {
            $scope.msg = "אנא מלא כנדרש את כל השדות";
            $("#ShowErrorMsg").modal('show');
            return;
        }
        var isNew = $scope.selectedUser.Id == 0;
        DataService.makePostRequest("Tasks.aspx?tp=updUser", $scope.selectedUser).then(
            function (response) {
                if (!response.RequestSucceed) return;
                var res = parseInt(response.Data);
                if (isNew) {
                    $scope.selectedUser.Id = res.Id;
                    $scope.data.User.push($scope.selectedUser);
                }
                else {
                    angular.forEach($scope.data.User, function (o,i) {
                        if (o.Id == res.Id)
                            $scope.data.User[i] = angular.copy($scope.selectedUser);
                    })
                }
                $scope.setPage('ManageUsers');
                $("#editUserModal").modal('hide');
                $scope.error = false;
            })
    };

    $scope.delUser = function () {
        DataService.makeGetRequest("Tasks.aspx?tp=delUser", {user: $scope.selectedUser.Id}).then(
            function (response) {
                if (!response.RequestSucceed) return;
                var res = parseInt(response.Data);
                angular.forEach($scope.data.User, function (o, i) {
                    if (o.Id == res.Id)
                        $scope.data.User[i] = $scope.data.User[i].IsArchive = true;
                })
                $scope.setPage('ManageUsers');
                $("#editUserModal").modal('hide');
                $scope.error = false;
            })
    }

    $scope.validUserForm = function () {
        var valid= true;
        if ($scope.selectedUser.DisplayName.length == 0)
            valid = false;
        if ($scope.selectedUser.EmailAddress.length == 0)
            valid = false;
        if ($scope.selectedUser.TelephoneNumber.length == 0)
            valid = false;
        if ($scope.selectedUser.Department == '')
            valid = false;
        if ($scope.selectedUser.Role == '')
            valid = false;
        if ($scope.selectedUser.UserPassword.length == 0)
            valid = false;
        return valid;
    }

}