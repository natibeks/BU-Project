﻿app.controller('HomeController', function ($scope, $rootScope, DataService, AuthService, Upload, FileReaderService, data) {
    $scope.data = data;
    $rootScope.loadingStatus = false;
    $scope.selectedMovie;
    $scope.uploadedImg = { File: null, Uploading: false };
    $scope.search = {
        Text: "",
        Advanced: false,
        Movie: true,
        Actors: true,
        Director: true,
        Genre: true,
        Year: true
    }

    $scope.movieTemplate = {
        Id: 0,
        Director: 0,
        Year: moment().year(),
        Genre: 0,
        Plot: "",
        Name: "",
        HasPoster: false
    }

    $scope.setAdvancedMode = function (flag) {
        $scope.search.Movie = true;
        $scope.search.Actors = true;
        $scope.search.Director = true;
        $scope.search.Genre = true;
        $scope.search.Year = true;

        $scope.search.Advanced = flag;
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

    $scope.isUserFreeToRent = function () {
        return !(AuthService.currentUser.MovieID > 0);
    }

    $scope.isMovieFreeToBeRent = function (movie) {
        return !(movie.WhoRent > 0);
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
            angular.forEach($scope.forms.movieForm, function (field,fieldName) {
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

    //startGetters

    $scope.getPageHeading = function () {
        if ($scope.search.Text.length > 0)
            return "Search Result";
        if ($scope.currentPage == 1)
        {
            if ($scope.popularPage)
                return "Popular Movie";
            else
                return "Movie Page";
        }
            
        if ($scope.currentPage == 2)
            return "Movies Table";
    }

    $scope.getSearchPlaceholder = function () {
        var str = "Search by ";
        if ($scope.search.Movie)
            str += "Movie Name";
        if ($scope.search.Actors)
            str += ", Actors";
        if ($scope.search.Director)
            str += ", Director";
        if ($scope.search.Genre)
            str += ", Genre";
        if ($scope.search.Year)
            str += ", Year";
        return str + " (DoubleClick for advanced search)";
    }

    $scope.getActorName = function (aid) {
        return Enumerable.From($scope.data.Actor).Where(function (x) { return x.Id == aid }).Select("$.Name").FirstOrDefault();
    }

    $scope.getDirector = function (aid) {
        return Enumerable.From($scope.data.Director).Where(function (x) { return x.Id == aid }).Select("$.Name").FirstOrDefault();
    }

    $scope.getGenre = function (aid) {
        return Enumerable.From($scope.data.Genre).Where(function (x) { return x.Id == aid }).Select("$.Name").FirstOrDefault();
    }

    $scope.getCurrentYearAsNum = function () {
        return moment().year();
    }

    //endGetters

    $scope.fitString = function (s, n) {
        if (typeof (s) == 'undefined' || s == null) {
            return "";
        }
        s = s.replace("'", "").replace("\"", "");
        return s.length > n ? (s.substring(0, n - 3) + "...") : s;
    }

    $scope.setFormObj = function (formname, formObj) {
        $scope.forms = formObj;
    }

    $scope.advancedSearchValues = [{ Title: "Movie name", Data: "Movie" },
    { Title: "Actors", Data: "Actors" },
    { Title: "Director", Data: "Director" },
    { Title: "Genre", Data: "Genre" },
    { Title: "Year", Data: "Year" }];

    $scope.$on('setNewestSelectedMovie', function (e) {
        var a = Enumerable.From($scope.data.Movie).Where(function (x) { return x.IsArchive != true && (x.WhoRent == 0 || x.WhoRent == null); }).ToArray();
        $scope.selectedMovie = angular.copy(a[a.length - 1]);

    })

    $scope.$on('resetMode', function (e) {
        $scope.editMode = false;
        $scope.uploadedImg = { File: null, Uploading: false };
    })
    $scope.setPage(1, true);
});