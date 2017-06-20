app.controller('HomeController', function ($scope, DataService, data) {
    $scope.data = data;
    $scope.dataLoaded = true;

    $scope.search = {
        Text: "",
        ResultView: false,
        Advanced: false,
        Movie: true,
        Actors: true,
        Director: true,
        Genre: true,
        Year: true
    }

    $scope.setAdvancedMode = function (flag) {
        $scope.search.Advanced = flag;
    }

    $scope.rentMovie = function (movieId) {

    }

    $scope.returnMovie = function () {

    }

    $scope.isUserFreeToRent = function() {
        return $scope.currentUser.MovieID > 0;
    }

    $scope.tableFields = [{ Title: "#", Width: "50px" },
    { Title: "Name", Width: "200px" },
    { Title: "Actors", Width: "200px" },
    { Title: "Director", Width: "auto" },
    { Title: "Genre", Width: "200px" }];

    $scope.advancedSearchValues = [{ Title: "Movie name", Data: "Movie" },
    { Title: "Actors", Data: "Actors" },
    { Title: "Director", Data: "Director" },
    { Title: "Genre", Data: "Genre" },
    { Title: "Year", Data: "Year" }];

    // pagination code
    $scope.pager = {
        curr: 0,
        size: 5,
    }
    $scope.isLastPage = function () { return $scope.pager.curr >= ($scope.data.Movie.length / $scope.pager.size - 1) };
    $scope.isFirstPage = function () { return $scope.pager.curr == 0 };
    $scope.incPage = function () { $scope.pager.curr++; };
    $scope.decPage = function () { $scope.pager.curr--; };
    $scope.numberOfPages = function () {
        return Math.ceil($scope.data.Movie.length / $scope.pager.size);
    };
    $scope.$watch('data.Movie.length', function () {
        if ($scope.pager.curr > ($scope.numberOfPages() - 1)) $scope.decPage();
    });
});