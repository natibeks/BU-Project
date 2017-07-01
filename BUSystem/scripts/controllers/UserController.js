app.expandUserController = function ($scope, DataService) {
    $scope.userTemplate = {
        Id: 0,
        DisplayName: "",
        EmailAddress: "",
        TelephoneNumber: "",
        Department: "",
        Role: 4,
        DomainID: "",
        UserPassword: "",
        Sn: "123456789",
        IsArchive: false,

    }

    $scope.setUserWin = function (user) {
        if (user == undefined)
            $scope.selectedUser = angular.copy($scope.userTemplate);
        else {
            $scope.selectedUser = angular.copy(user);
            $scope.selectedUser["DomainID"] = Enumerable.From($scope.data.UserDomain).Where(function (x) { return x.UserID == user.Id }).Select(function(y){return y.DomainID;}).FirstOrDefault();
        }
        $("#editUserModal").modal('show');
    }

    $scope.updateUser = function () {
        if (!$scope.validUserForm()) {
            $scope.msg = "אנא מלא כנדרש את כל השדות";
            $("#ShowErrorMsg").modal('show');
            return;
        }
        if ($scope.isUserExist()) {
            $scope.msg = "קיים משתמש עם נתוני חובה זהים";
            $("#ShowErrorMsg").modal('show');
            return;
        }
        var isNew = $scope.selectedUser.Id == 0;
        DataService.makePostRequest("Tasks.aspx?tp=updUser", $scope.selectedUser).then(
            function (response) {
                if (!response.RequestSucceed) return;
                var res = parseInt(response.Data);
                if (isNew) {
                    $scope.selectedUser.Id = res;
                    $scope.data.User.push($scope.selectedUser);
                }
                else {
                    angular.forEach($scope.data.User, function (o,i) {
                        if (o.Id == res)
                            $scope.data.User[i] = angular.copy($scope.selectedUser);
                    })
                    angular.forEach($scope.data.UserDomain, function (o, i) {
                        if (o.UserID == res) {
                            $scope.data.UserDomain[i].DomainID = $scope.selectedUser.DomainID;
                            $scope.data.UserDomain[i].IsManager = $scope.selectedUser.Role < 4;
                        }
                            
                    })
                }
                $scope.setPage('ManageUsers');
                $("#editUserModal").modal('hide');
                $scope.error = false;
            })
    };

    $scope.deleteUser = function () {
        DataService.makeGetRequest("Tasks.aspx?tp=delUser", {user: $scope.selectedUser.Id}).then(
            function (response) {
                if (!response.RequestSucceed) return;
                angular.forEach($scope.data.User, function (o, i) {
                    if (o.Id == $scope.selectedUser.Id)
                        $scope.data.User[i].IsArchive = true;
                })
                $scope.setPage('ManageUsers');
                $("#confirmDeleteModal").modal('hide');
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
        if ($scope.selectedUser.Department == 4) {
            if ($scope.selectedUser.DomainID == '')
                valid = false;
            if ($scope.selectedUser.Role == '')
                valid = false;
        }
        if ($scope.selectedUser.UserPassword.length == 0)
            valid = false;
        if ($scope.selectedUser.Sn.length != 9)
            valid = false;
        return valid;
    }

    $scope.isUserExist = function () {
        var exist = Enumerable.From($scope.data.User).Where(function (x) {
            return x.EmailAddres == $scope.selectedUser.EmailAddress ||
                x.TelephoneNumber == $scope.selectedUser.TelephoneNumber ||
                x.Sn == $scope.selectedUser.Sn;
        }).Count();
        return exist > 0;
    }
 
}