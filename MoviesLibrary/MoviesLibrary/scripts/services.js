//DataService controls on http request to server including handle server errors

app.factory('DataService', dataService);
app.factory('AuthService', authService);
app.factory('FileReaderService', fileReaderService);

function dataService($http, $q, Upload) {
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

    dataService.setMovieAsAvailable = function (movieId,userId) {
        var d = $q.defer();
        dataService.makeGetRequest("returnmovie", { movie: movieId }).then(
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
        selectedMovie["HasNewPoster"] = selectedMovie["HasNewPoster"] == undefined ? false : selectedMovie["HasNewPoster"];
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
                            if (index == -1)
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
                    if (!selectedMovie.HasPoster && selectedMovie.HasNewPoster)
                         selectedMovie.HasPoster = true;
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
        return d.promise;
    }

    dataService.deleteMovie = function (selectedMovie) {
        var d = $q.defer();
        dataService.makeGetRequest("deletemovie", { movieid: selectedMovie.Id }).then(
            function (response) {
                if (!response.RequestSucceed) d.reject(false);
                selectedMovie.IsArchive = true;
                angular.forEach(dataService.dataObject.Movie, function (o, i) {
                    if (o.Id == selectedMovie.Id) {
                        dataService.dataObject.Movie[i] = angular.copy(selectedMovie);
                    }
                });
                d.resolve(true);
            });
        return d.promise;
    }

    dataService.uploadImage = function (file, selectedMovie) {
        var d = $q.defer();
        Upload.upload({
            url: 'FileHandler.ashx?id=' + selectedMovie.Id,
            data: {
                file: file
            }
        }).then(function (resp) {           
            if (selectedMovie.Id == 0){
                selectedMovie["PosterTS"] = resp.data;
                selectedMovie["HasNewPoster"] = true;
            }
            else
                selectedMovie.HasPoster = true;

            console.log('File uploaded successfuly.');
            d.resolve(true);
            return d.promise;
        }, function (msg) {
            dataServiceError(msg);
        });
    }

    function dataServiceError(errorResponse) {
        if (errorResponse.status == 500) {
            $("#errorModalText").html("Server operation failed. It may happened because server failure.");
            $('#responseErrorModal').modal('show');
        }      
        console.log("ERROR TEXT: " + errorResponse.data);
        return { RequestSucceed: false };
    }

    return dataService;
}
function authService(DataService, $location) {
    var authService = {};
    authService.login = function (userObj) {
        return DataService.makePostRequest("login", userObj).then(
            function (response) {
                if (!response.RequestSucceed) return { Succeed: false };
                if (response.Data.Id.length > 0) {
                    authService.currentUser = response.Data;
                    return { Succeed: true, User: response.Data };
                }
                else {
                    return { Succeed: false }
                }
            })
    };

    authService.logout = function () {
        authService.currentUser = null;
        $location.path('/Login');
    };

    return authService;
}
function fileReaderService($q) {

    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}