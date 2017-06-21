app.controller('HomeController', function ($scope, DataService, data) {
    $scope.data = data;
    $scope.dataLoaded = true;

    $scope.search = {
        Text: "",
        Advanced: false,
        Movie: true,
        Actors: true,
        Director: true,
        Genre: true,
        Year: true
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
        return str;
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

    }

    $scope.returnMovie = function () {

    }

    $scope.isUserFreeToRent = function() {
        return $scope.currentUser.MovieID > 0;
    }

    $scope.advancedSearchValues = [{ Title: "Movie name", Data: "Movie" },
    { Title: "Actors", Data: "Actors" },
    { Title: "Director", Data: "Director" },
    { Title: "Genre", Data: "Genre" },
    { Title: "Year", Data: "Year" }];

});