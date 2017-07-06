app.expandMovieController = function ($scope, DataService, AuthService, Upload, FileReaderService, data) {
    $scope.movieTemplate = {
        Id: 0,
        Director: 0,
        Year: moment().year(),
        Genre: 0,
        Plot: "",
        Name: "",
        HasPoster: false
    }

    $scope.rentMovie = function (movieId) {
        DataService.setMovieAsRent(movieId, AuthService.currentUser.Id).then(function (x) {
            if (x) {
                $scope.data = DataService.getData();
                AuthService.currentUser.MovieID = movieId;
            }

        })
    }

    $scope.returnMovie = function () {
        DataService.setMovieAsAvailable(AuthService.currentUser.MovieID, AuthService.currentUser.Id).then(function (x) {
            if (x) {
                $scope.data = DataService.getData();
                AuthService.currentUser.MovieID = 0;
            }

        })
    }

    $scope.setEditMode = function (flag) {
        $scope.editMode = flag;
        if (flag)
            $scope.selectedMovie["Actors"] = Enumerable.From($scope.data.Actor).Where(function (x) {
                var CountExistance = Enumerable.From($scope.data.MovieActor).Where(function (y) { return y.MovieID == $scope.selectedMovie.Id && x.Id == y.ActorID; }).Count();
                return CountExistance > 0;
            }).ToArray();
        else
            $scope.fromNewToMovies();
    }

    $scope.saveChanges = function () {
        if ($scope.forms.movieForm.$valid)
            DataService.updateMovie($scope.selectedMovie).then(function (x) {
                if (x) // succeed
                {
                    $scope.data = DataService.getData();
                    $scope.editMode = false;
                }

            })
        else {
            $("#errorModalText").html("Please fill in all the relavent fields.");
            $('#responseErrorModal').modal('show');
            angular.forEach($scope.forms.movieForm, function (field, fieldName) {
                if (!fieldName.startsWith('$'))
                    field.$setDirty();
            });
        }
    }

    $scope.setNewMovie = function () {
        $scope.setMovie();
        $scope.setEditMode(true);
    }

    $scope.delMovie = function () {
        DataService.deleteMovie($scope.selectedMovie).then(function (x) {
            if (x) // succeed
                $scope.data = DataService.getData();
        })
    }

    $scope.setMovie = function (movie) {
        if (movie != undefined) {
            var temp = Enumerable.From($scope.data.Movie).Where(function (x) { return x.Id == movie }).FirstOrDefault();
        }
        else
            var temp = $scope.movieTemplate;
        $scope.selectedMovie = angular.copy(temp);
        $scope.editMode = false;
        $scope.setPage(1);
    }

    $scope.fromNewToMovies = function () {
        if ($scope.selectedMovie.Id == 0) {
            $scope.selectedMovie == null;
            $scope.setPage(2);
        }
    }

    $scope.changeImageSelect = function () {
        $scope.tempImageSrc = null;
        $scope.uploadedImg.File = null;
        $scope.selectedMovie.HasPoster = false;
        $scope.selectedMovie.HasNewPoster = false;
    }

    $scope.$watch('uploadedImg.File', function () {
        if ($scope.uploadedImg != null)
            //$scope.uploadFile($scope.uploadedImg.File);
            if ($scope.uploadedImg.File != null)
                FileReaderService.readAsDataUrl($scope.uploadedImg.File, $scope)
                    .then(function (result) {
                        $scope.tempImageSrc = result;
                    });

    });

    $scope.uploadFile = function (file) {
        if (file) {
            if (!file.$error) {
                $scope.uploadedImg.Uploading = true;
                DataService.uploadImage(file, $scope.selectedMovie).then(function (x) {
                    $scope.uploadedImg.Uploading = false;
                });
            }
        }
    };

    $scope.setFormObj = function (formname, formObj) {
        $scope.forms = formObj;
    }

}
