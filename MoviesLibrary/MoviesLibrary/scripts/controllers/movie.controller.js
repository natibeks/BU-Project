app.expandMovieController = function ($scope, DataService, AuthService, Upload, FileReaderService, data) {
    $scope.movieTemplate = {
        Id: 0,
        Director: 0,
        Year: moment().year(),
        Genre: 0,
        Plot: "",
        Name: "",
        HasPoster: false,
        Actors: []
    }

    $scope.rentMovie = function (movieId) {
        DataService.setMovieAsRent(movieId, AuthService.currentUser.Id).then(function (x) {
            if (x) {
                $scope.data = DataService.getData();
                AuthService.currentUser.MovieID = movieId;
            }

        })
    }

    $scope.isMovieCanBeRented = function (movie) {
        return (movie.FreeQuantity > 0);
    }

    $scope.isMovieRentedByUser = function (movie) {
        var c = Enumerable.From($scope.data.UserMovie).Where(function (x) { return x.MovieID == movie.Id }).Count();
        return c > 0;
    }

    $scope.openReturnModal = function () {
        $("#returnsModal").modal('show');
    }

    $scope.returnMovie = function (movieId) {
        DataService.setMovieAsAvailable(movieId, AuthService.currentUser.Id).then(function (x) {
            if (x) {
                $scope.data = DataService.getData();
                var count = Enumerable.From($scope.data.UserMovie).Where(function(x){return x.UserID == AuthService.currentUser.Id}).Count();
                if(count==0)
                    $("#returnsModal").modal('hide');
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
        {
            $scope.fromNewToMovies();
            if($scope.selectedMovie.HasPosterBackup!=undefined)
                $scope.selectedMovie.HasPoster = $scope.selectedMovie.HasPosterBackup;
        }
            
    }

    $scope.saveChanges = function () {
        if ($scope.forms.movieForm.$valid)
            DataService.updateMovie($scope.selectedMovie).then(function (x) {
                if (x) // succeed
                {
                    $scope.data = DataService.getData();
                    $scope.editMode = false;
                    $scope.applySaftly();
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
            if (x) {
                $scope.data = DataService.getData();
                $scope.setPage(2);

            }// succeed
             
        })
    }

    $scope.setMovie = function (movie) {
        if (movie != undefined) {
            var temp = Enumerable.From($scope.data.Movie).Where(function (x) { return x.Id == movie }).FirstOrDefault();
        }
        else
            var temp = $scope.movieTemplate;
        $scope.selectedMovie = angular.copy(temp);
        $scope.setMoviePoster();
        console.log($scope.selectedMovie);
        console.log($scope.data.MovieActor);
        console.log($scope.data.Movie);
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
        if ($scope.selectedMovie.HasPosterBackup != undefined)
            $scope.selectedMovie.HasPoster = $scope.selectedMovie.HasPosterBackup;
        else
            $scope.selectedMovie.HasPosterBackup = $scope.selectedMovie.HasPoster;        
        $scope.selectedMovie.HasNewPoster = false;
    }

    $scope.getPosterSrc = function () {
        var src = "posters/" + $scope.selectedMovie.Id + ".jpg?" + new Date().getTime();
        return src;
    }

    $scope.setMoviePoster = function () {
        $scope.moviePosterUrl = $scope.getPosterSrc();
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
                    $scope.setMoviePoster();

                });
            }
        }
    };

    $scope.setFormObj = function (formname, formObj) {
        $scope.forms = formObj;
    }

    $scope.getUserMovieList = function () {
        if ($scope.currentUser == undefined) return;
        var movie = DataService.getData();
        movie = movie.UserMovie;
        movie = Enumerable.From(movie).Where(function (x) { return x.UserID == $scope.currentUser.Id }).ToArray();
        return movie;

    }

    $scope.getMovieName = function (movieId) {
        return DataService.getMovieName(movieId);
    }

}
