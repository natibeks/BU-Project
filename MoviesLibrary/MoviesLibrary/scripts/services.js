//DataService controls on http request to server including handle server errors

app.factory('DataService', dataService);
app.factory('AuthService', authService);

function dataService($http) {
    var dataService = {};
    var dataObject = [];
    var loadingStatus = false;
    dataService.makeGetRequest = function (url, params) {
        var requestUrl = url;
        angular.forEach(params, function (value, key) {
            requestUrl = requestUrl + '&' + key + '=' + value;
        });
        return $http.get(requestUrl).then(function (response) {
            return { RequestSucceed: true, Data: response.data };
        }).catch(dataServiceError);
    }

    dataService.makePostRequest = function (url, obj) {
        var requestUrl = url;
        var url = "RequestsHandler.aspx?key=" + keyVal;
        return $http.post(requestUrl, obj).then(function (response) {
            return { RequestSucceed: true, Data: response.data };
        }).catch(dataServiceError);
    }

    dataService.getAllData = function (id, isadmin) {
        var url = "RequestsHandler.aspx?key=getdata";
        loadingStatus = true;
        dataObject = makeGetRequest(url, { id: id, isadmin: isadmin });
        dataObject = dataObject.Data;
        loadingStatus = false;
        return dataObject;
    }

    dataService.getData = function () {
        return dataObject;
    }

    dataService.getLoadingStatus = function () {
        return loadingStatus;
    }

    function dataServiceError(errorResponse) {
        if (errorResponse.status == 500) {
            $("#errorModalText").html("קרתה שגיאה במהלך התקשורת עם השרת. בדוק נתונים או נסה שנית.");
        }
        $('#responseErrorModal').modal('show');
        console.log("ERROR TEXT: " + errorResponse.data);
        return { RequestSucceed: false };
    }

    return data;
}
function authService(DataService) {
    var authService = {};

    authService.login = function (userObj) {
        return DataService.makePostRequest("RequestsHandler.aspx?key=login", userObj).then(
            function (response) {
                if (!response.RequestSucceed) return;
                authService.user = response.Data;
                $location.path("/Home");
                return response.Data;
            })
    };

    return authService;
}