app.controller('TableController', function ($scope, DataService, AuthService) {
    $scope.sort = {
        Name: "Id",
        Desc: false
    }
    $scope.hoverMovie = 0;
    $scope.hoverMovieRow = function (id, hoverin) {
        if (hoverin)
            $scope.hoverMovie = id;
        else
            $scope.hoverMovie = 0;
    }

    $scope.isMovieCanBeRented = function (movie) {
        return (movie.FreeQuantity > 0);
    }

    $scope.isMovieRentedByUser = function (movie) {
        var c = Enumerable.From($scope.data.UserMovie).Where(function (x) { return x.MovieID == movie.Id }).Count();
        return c > 0;
    }

    $scope.tableFields = [{ Title: "#", Width: "50px" },
        { Title: "Name", Width: "200px" },
        { Title: "Plot", Width: "auto" },
        { Title: "Actors", Width: "150px" },
        { Title: "Year", Width: "100px" },
        { Title: "Genre", Width: "150px" },
    { Title: "At Stock", Width: "80px"}];

    $scope.tableFilter = function (m) {
        if (m.IsArchive) return false;
        var k = $scope.search.Text.trim();
        k = k.toLowerCase();
        var contains = k == "";

        if ($scope.search.Advanced) {
            return (m.Name.toString().toLowerCase().indexOf(k)>-1 && $scope.search.Movie) ||
                (m.Id.toString().indexOf(k) > -1 && $scope.search.Movie) ||
                ($scope.isActorsNameMatch(m.Id, k) && $scope.search.Actors) ||
                ($scope.getDirector(m.Director).toLowerCase().indexOf(k) > -1 && $scope.search.Director) ||
                ($scope.getGenre(m.Genre).toLowerCase().indexOf(k) > -1 && $scope.search.Genre) ||
                (m.Year.toString().indexOf(k) > -1 && $scope.search.Year);
        }
        else
            return ((m.Name).toLowerCase().indexOf(k) > -1 || (m.Id.toString()).indexOf(k) > -1) || $scope.isActorsNameMatch(m.Id, k) ||
                $scope.getDirector(m.Director).toLowerCase().indexOf(k) > -1 || $scope.getGenre(m.Genre).toLowerCase().indexOf(k) > -1
                || m.Year.toString().indexOf(k) > -1;
    }

    $scope.setSort = function (c, desc) {
        if (c == "#") c = "Id";
        $scope.sort.Name = c;
        $scope.sort.Desc = !$scope.sort.Desc;
    }

    $scope.isActorsNameMatch = function (movie, key) {
        var arr = Enumerable.From($scope.data.MovieActor).Where(function (x) { return movie == x.MovieID; }).Select("$.ActorID").ToArray();
        var cnt = Enumerable.From($scope.data.Actor).Where(function (x) { return arr.indexOf(x.Id) > -1 && x.Name.toLowerCase().indexOf(key) > -1; }).Count();
        return cnt > 0;
    }

    $scope.setMovie = function (movie) {
        var temp = Enumerable.From($scope.data.Movie).Where(function (x) { return x.Id == movie }).FirstOrDefault();
        $scope.$parent.selectedMovie = angular.copy(temp);
        $scope.editMode = false;
        $scope.setPage(1);
    }

    $scope.privilateFilter = function (c) {
        if (c.Title == 'At Stock')
            return $scope.currentUser.Admin;
        return true;
    }

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