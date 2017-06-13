app.expandSearchController = function ($scope, $http, $timeout, $filter) {

    $scope.customSearch = 0;

    $scope.toSearch = {
        text: "",
        status: "",
        category: "",
        OpenFrom: "",
        OpenTo: "",
        CloseFrom: "",
        CloseTo: ""
    }

    $scope.msg = "";

    $scope.key = "";

    $scope.searchResult = "";
    $scope.searchResult2 = "";

    $scope.CategoryToSearchFilter = function (item) {
        if ($scope.currentUser.Permission != '4')
            return $scope.currentUser.Domain == item.Domain;
        else
            return true;
    }
  
    $scope.resetSearch = function () {
        $scope.toSearch.text = "";
        $scope.toSearch.status = "";
        $scope.toSearch.category = "";
        $scope.toSearch.OpenFrom = "";
        $scope.toSearch.OpenTo = "";
        $scope.toSearch.CloseFrom = "";
        $scope.toSearch.CloseTo = "";
        $scope.searchResult = "";
        $scope.searchResult2 = "";
    }

   
    $scope.freeSearch = function () {
        $scope.key = $scope.toSearch.text.trim();
        if ($scope.key == "") {
            $scope.msg = "אנא הזן ערך לחיפוש";
            $('#ShowErrorMsg').modal('show');
        }
        else {
            $scope.searchResult2 = Enumerable.From($scope.data.TicketsToDo).Where(function (i) {
                return ((i.Description).includes($scope.key) || (i.idTicket.toString()).includes($scope.key)) ||
                    i.CategoryName.includes($scope.key) || i.Building.includes($scope.key) || i.Building.includes($scope.Room)
            }).ToArray();

            $scope.dataLength = $scope.searchResult2.length;
            $scope.noOfPages = Math.ceil($scope.dataLength / $scope.pageSize);
            $scope.currPage = 1;
            $scope.searchResultExist = true;

        }


    }

    $scope.customSearch = function () {
        if ($scope.toSearch.status == "" && $scope.toSearch.category == "" && $scope.toSearch.OpenFrom == "" && $scope.toSearch.OpenTo == ""
            && $scope.toSearch.CloseFrom == "" && $scope.toSearch.CloseTo == "") {
            $scope.msg = "לא נמצא ערך לחיפוש. אנא מלא לפחות שדה אחד.";
            $('#ShowErrorMsg').modal('show');
        }
        else {
            if (($scope.toSearch.OpenFrom != "" || $scope.toSearch.OpenTo != "")
            && ($scope.toSearch.CloseFrom != "" || $scope.toSearch.CloseTo != ""))
            {
                $scope.msg = "חיפוש שגוי. לא ניתן למלא גם תאריכי פתיחה וגם סגירה. ";
                $('#ShowErrorMsg').modal('show');
            }
            else {
                $scope.searchResult2 = Enumerable.From($scope.data.TicketsToDo).Where(function (i) {
                    var dateOpen = moment(i.TimeOpen, 'DD-MM-YYYY');
                    var f1 = $scope.toSearch.OpenFrom == "" ? null : moment($scope.toSearch.OpenFrom, 'DD-MM-YYYY');
                    var t1 = $scope.toSearch.OpenTo == "" ? null : moment($scope.toSearch.OpenTo, 'DD-MM-YYYY');
                    var dateClose = moment(i.TimeClose, 'DD-MM-YYYY');
                    var f2 = $scope.toSearch.CloseFrom == "" ? null : moment($scope.toSearch.CloseFrom, 'DD-MM-YYYY');
                    var t2 = $scope.toSearch.CloseTo == "" ? null : moment($scope.toSearch.CloseTo, 'DD-MM-YYYY');
                    var c = $scope.toSearch.category;
                    var s = $scope.toSearch.status;

                    return i.CategoryName.includes(c) && i.Status.includes(s)
                        && ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]')) || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) || (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
                        && ((f2 == null && t2 == null) || (f2 != null && t2 != null && dateOpen.isBetween(f2, t2, 'days', '[]')) || (f2 != null && t2 == null && dateOpen.isSameOrAfter(f2)) || (t2 != null && f2 == null && dateOpen.isSameOrBefore(t2)))
                        && i.Domain==$scope.currentUser.Domain
                }).ToArray();

                $scope.dataLength = $scope.searchResult2.length;
                $scope.noOfPages = Math.ceil($scope.dataLength / $scope.pageSize);
                $scope.currPage = 1;

            }
            $scope.searchResultExist = true;
            
        }
    }
}
