app.controller('TableController', function ($scope, DataService) {
    $scope.sort = {
        Name: "Id",
        Desc: false
    }

    $scope.tableFields = [{ Title: "#", Width: "50px" },
        { Title: "Name", Width: "200px" },
        { Title: "Actors", Width: "200px" },
        { Title: "Director", Width: "auto" },
        { Title: "Genre", Width: "200px" }];

    $scope.tableFilter = function () {
        if ($scope.search.Advanced) {
            return (m.Name.includes($scope.search.Text) && $scope.search.Movie) ||
                (m.Id.toString().includes($scope.search.Text) && $scope.search.Movie) ||
                ($scope.isActorsNameMatch($scope.search.Text)  && $scope.search.Actors) ||
                ($scope.getDirector(m.Director).includes($scope.search.Text) && $scope.search.Movie) ||
                ($scope.getGenre(m.Genre).includes($scope.search.Text) && $scope.search.Movie) ||
                (m.Year.includes($scope.search.Text) && $scope.search.Movie);
        }
        else
            return ((m.Name).includes($scope.search.Text) || (m.Id.toString()).includes($scope.search.Text)) || $scope.isActorsNameMatch($scope.search.Text) ||
                $scope.getDirector(m.Director).includes($scope.search.Text) || $scope.getGenre(m.Genre).includes($scope.search.Text)
                || m.Year.includes($scope.search.Text);
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