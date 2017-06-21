//DataService controls on http request to server including handle server errors

app.factory('DataService', dataService);
app.factory('AuthService', authService);

function dataService($http) {
    var dataService = {
        loadingStatus: false,
    };
    dataService.makeGetRequest = function (url, params) {
        var requestUrl = url;
        angular.forEach(params, function (value, key) {
            requestUrl = requestUrl + '&' + key + '=' + value;
        });
        return $http.get(requestUrl).then(
            function (response) {
                return { RequestSucceed: true, Data: response.data };
        }).catch(dataServiceError);
    }

    dataService.makePostRequest = function (url, obj) {
        var requestUrl = url;
        //var url = "RequestsHandler.aspx?key=" + keyVal;
        return $http.post(requestUrl, obj).then(
            function (response) {
                return { RequestSucceed: true, Data: response.data };
        }).catch(dataServiceError);
    }

    dataService.getAllData = function (id, isadmin) {
        var url = "RequestsHandler.aspx?key=getdata";
        dataService.loadingStatus = true;
        dataService.makeGetRequest(url, { id: id, isadmin: isadmin }).then(
            function (response) {
                if (!response.RequestSucceed) return;
                dataService.dataObject = response.Data;
                dataService.loadingStatus = false;
                return dataService.dataObject;
                // need to send here a promise! or using async await
        });  
    }

    dataService.getData = function () {
        return dataService.dataObject;
    }

    function dataServiceError(errorResponse) {
        if (errorResponse.status == 500) {
            $("#errorModalText").html("קרתה שגיאה במהלך התקשורת עם השרת. בדוק נתונים או נסה שנית.");
        }
        $('#responseErrorModal').modal('show');
        console.log("ERROR TEXT: " + errorResponse.data);
        return { RequestSucceed: false };
    }

    return dataService;
}
function authService(DataService) {
    var authService = {
        loginStatus: false
    };
    authService.login = function (userObj) {
        return DataService.makePostRequest("RequestsHandler.aspx?key=login", userObj).then(
            function (response) {
                if (!response.RequestSucceed) return;
                if (response.Data.Id.length > 0) {
                    authService.currentUser = response.Data;
                    return { Succeed: true, User: response.Data };
                }
                else {
                    return { Succeed: false }
                }
            })
    };

    authService.setLoginStatus = function (flag) {
        authService.loginStatus = flag;
    }
    return authService;
}