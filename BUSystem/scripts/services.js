app.factory('DataService', dataService);

function dataService($http) {
    var data = {
        getAll: getAll,
        setLogged: setLogged,
        makeGetRequest: makeGetRequest,
        makePostRequest: makePostRequest
    };
    function makeGetRequest(url, params) {
        var requestUrl = url;
        angular.forEach(params, function (value, key) {
            requestUrl = requestUrl + '&' + key + '=' + value;
        });
        return $http.get(requestUrl).then(function (response) {
            return { RequestSucceed: true, Data: response.data };
        }).catch(dataServiceError);
    }

    function makePostRequest(url, obj) {
        var requestUrl = url;      
        return $http.post(requestUrl, obj).then(function (response) {
            return { RequestSucceed: true, Data: response.data };
        }).catch(dataServiceError);
    }

    function getAll(id,isadmin) {
        var url = "Tasks.aspx?tp=GetInitData";
        return makeGetRequest(url, { id: id, isadmin: isadmin });
    }

    function setLogged(uid) {
        var url = "Tasks.aspx?tp=setUserAsLogged";
        return makeGetRequest(url, { uid: uid });
    }

    function prepareDate(data) {

    }

    return data;

    function dataServiceError(errorResponse) {
        if (errorResponse.status == 500) {
            $("#errorModalText").html("קרתה שגיאה במהלך שמירת הנתונים בשרת. בדוק נתונים או נסה שנית.");
        }
        $('#ShowResponseErrorMsg').modal('show');
        console.log("ERROR TEXT: " + errorResponse.data);
        return { RequestSucceed: false };
    }
}