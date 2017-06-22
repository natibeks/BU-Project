//DataService controls on http request to server including handle server errors

app.factory('DataService', dataService);
app.factory('AuthService', authService);

function dataService($http, $q) {
    var dataService = {};
    dataService.makeGetRequest = function (keyValue, params) {
        var url = "RequestsHandler.aspx?key=";
        var requestUrl = url + keyValue;
        angular.forEach(params, function (value, key) {
            requestUrl = requestUrl + '&' + key + '=' + value;
        });
        return $http.get(requestUrl).then(
            function (response) {
                return { RequestSucceed: true, Data: response.data };
            }).catch(dataServiceError);
    }

    dataService.makePostRequest = function (keyValue, obj) {
        var url = "RequestsHandler.aspx?key=";
        var requestUrl = url + keyValue;
        return $http.post(requestUrl, obj).then(
            function (response) {
                return { RequestSucceed: true, Data: response.data };
            }).catch(dataServiceError);
    }

    dataService.getAllData = function (id, isadmin) {
        var d = $q.defer();
        dataService.loadingStatus = true;
        dataService.makeGetRequest("getdata", { id: id, isadmin: isadmin }).then(
            function (response) {
                if (!response.RequestSucceed) d.reject(false);
                dataService.dataObject = response.Data;
                dataService.loadingStatus = false;
                d.resolve(dataService.dataObject);
                // need to send here a promise! or using async await
            });
        return d.promise;
    }

    dataService.getData = function () {
        return dataService.dataObject;
    }

    dataService.setMovieAsRent = function (movieId, userId) {
        var d = $q.defer();
        dataService.makeGetRequest("rentmovie", { user: userId, movie: movieId }).then(
            function (response) {
                if (!response.RequestSucceed) d.reject(false);
                angular.forEach(dataService.dataObject.User, function (o, i) {
                    if (o.Id == userId) {
                        dataService.dataObject.User[i].MovieID = movieId;
                    }
                });
                angular.forEach(dataService.dataObject.Movie, function (o, i) {
                    if (o.Id == movieId)
                        dataService.dataObject.Movie[i].WhoRent = userId;
                })
                d.resolve(true);
            });
        return d.promise;
    }

    dataService.setMovieAsAvailable = function (movieId) {
        var d = $q.defer();
        dataService.makeGetRequest("rentmovie", { movie: movieId }).then(
            function (response) {
                if (!response.RequestSucceed) d.reject(false);
                angular.forEach(dataService.dataObject.User, function (o, i) {
                    if (o.Id == userId) {
                        dataService.dataObject.User[i].MovieID = 0;
                    }
                });
                angular.forEach(dataService.dataObject.Movie, function (o, i) {
                    if (o.Id == movieId)
                        dataService.dataObject.Movie[i].WhoRent = "";
                })
                d.resolve(true);
            });
        return d.promise;
    }

    dataService.updateMovie = function (selectedMovie) {
        var d = $q.defer();
        dataService.makePostRequest("updatemovie", selectedMovie).then(
            function (response) {
                if (!response.RequestSucceed) d.reject(false);
                selectedMovie.Id = response.Data.Id;
                if (!response.Data.IsNew) {
                    angular.forEach(dataService.dataObject.Movie, function (o, i) {
                        if (o.Id == selectedMovie.Id) {
                            dataService.dataObject.Movie[i] = angular.copy(selectedMovie);
                        }
                    });
                    var arr = Enumerable.From(selectedMovie.Actors).Select("$.Id").ToArray();
                    angular.forEach(dataService.dataObject.MovieActor, function (o, i) {                            
                        if (o.MovieID == selectedMovie.Id) {
                            var index = arr.indexOf(o.ActorID)
                            if(index==-1)
                                dataService.dataObject.MovieActor[i].IsArchive = true;
                            else
                                arr.splice(index, 1);
                        }
                    })
                    angular.forEach(arr, function (o, i) {
                        dataService.dataObject.MovieActor.push({
                            MovieID: selectedMovie.Id,
                            ActorID: o,
                            IsArchive: false
                        })
                    })
              
                } // is new movie
                else {
                    dataService.dataObject.Movie.push(selectedMovie);
                    angular.forEach(selectedMovie.Actors, function (p, j) {
                        dataService.dataObject.MovieActor.push({
                            MovieID: selectedMovie.Id,
                            ActorID: p.Id,
                            IsArchive: false
                        })
                    })
                }

                d.resolve(true);

            })
    }

    function dataServiceError(errorResponse) {
        if (errorResponse.status == 500) {
            $("#responseErrorModal").html("קרתה שגיאה במהלך התקשורת עם השרת. בדוק נתונים או נסה שנית.");
        }
        $('#responseErrorModal').modal('show');
        console.log("ERROR TEXT: " + errorResponse.data);
        return { RequestSucceed: false };
    }

    return dataService;
}
function authService(DataService) {
    var authService = {};
    authService.login = function (userObj) {
        return DataService.makePostRequest("login", userObj).then(
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

    return authService;
}