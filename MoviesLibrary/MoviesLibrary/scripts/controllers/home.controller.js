app.controller('HomeController', function ($scope, $rootScope, DataService, AuthService, Upload, FileReaderService, data) {

    app.expandMovieController($scope, DataService, AuthService, Upload, FileReaderService, data);

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

    $scope.setAdvancedMode = function (flag) {
        $scope.search.Movie = true;
        $scope.search.Actors = true;
        $scope.search.Director = true;
        $scope.search.Genre = true;
        $scope.search.Year = true;

        $scope.search.Advanced = flag;
    }

    $scope.isUserRentedMovies = function () {
        if (AuthService.currentUser == undefined) return;
        var count = Enumerable.From($scope.data.UserMovie).Where(function (x) { return x.UserID == AuthService.currentUser.Id; }).Count();
        return count > 0;
    }

    $scope.isMovieFreeToBeRent = function (movie) {
        return !(movie.FreeQuantity > 0);
    }

    //startGetters

    $scope.getPageHeading = function () {
        if ($scope.search.Text.length > 0)
            return "Search Result";
        if ($scope.currentPage == 1)
        {
            if ($scope.popularPage)
                return "Recent Added Movie";
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

    $scope.advancedSearchValues = [{ Title: "Movie name", Data: "Movie" },
    { Title: "Actors", Data: "Actors" },
    { Title: "Director", Data: "Director" },
    { Title: "Genre", Data: "Genre" },
    { Title: "Year", Data: "Year" }];

    $scope.$on('setNewestSelectedMovie', function (e) {
        var a = Enumerable.From($scope.data.Movie).Where(function (x) { return x.IsArchive != true; }).ToArray();
        $scope.selectedMovie = angular.copy(a[a.length - 1]);
        $scope.setMoviePoster();

    })

    $scope.$on('resetMode', function (e) {
        $scope.editMode = false;
        $scope.uploadedImg = { File: null, Uploading: false };
    })
    $scope.setPage(1, true);
});