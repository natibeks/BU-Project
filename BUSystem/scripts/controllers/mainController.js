app.controller('myController', function ($scope, $http, $timeout, $filter, $window, DataService) {

    app.expandTicketController($scope, $http, $timeout, $filter);
    app.expandSearchController($scope, $http, $timeout, $filter);
    app.expandReportsController($scope, $http, $timeout, $filter, $window);

    $scope.pageConfig = PageConfig;
    $scope.pageSize = 10;
    $scope.dataLength;
    $scope.noOfPages;
    $scope.currPage = 1;
    $scope.appMenu = AppMenu;
    $scope.sort = { Name: 'Id', Desc: true };
      
    angular.element(document).ready(function () {
        if (typeof ($scope.UserId) == 'undefined') return;
        var isAdmin = $scope.UserLevel == 0;
        var url = "Tasks.aspx?tp=GetInitData";
        DataService.getAll($scope.UserId, isAdmin).then(function (response) {
            $scope.data = angular.copy(response);
            console.log($scope.data);
            $scope.initUserValues();
            //$scope.updateEmployeeTable();
        });
    })
    //$scope.updateEmployeeTable = function () {
    //    $.each($scope.data.Employee, function (i, o) {
    //        $scope.data.Employee[i]["Name"] = Enumerable.From($scope.data.User).Where(function (j) { return j.Id == o.idEmployee }).Select('$.DisplayName').FirstOrDefault();
    //    })
    //}

    $scope.initUserValues = function() {
        $scope.currentUser = Enumerable.From($scope.data.User).Where(function (j) { return j.Id == $scope.UserId }).FirstOrDefault();
        $scope.currentUser["Permission"] = $scope.currentUser.Role;
        $scope.currentUser.Domains = Enumerable.From($scope.data.EmployeeDomains).Where(function (j) { return j.EmployeeID ==$scope.currentUser.Id }).Select(function (i) { return i.Domain}).ToArray();
    }

    $scope.setSort = function (c) {
        $scope.sort.Name = c;
        $scope.sort.Desc = !$scope.sort.Desc;
    }

    $scope.getDepartment = function (id) {
        var e = Enumerable.From($scope.data.Department).Where(function (x) { return x.Id == id }).FirstOrDefault();
        e = e == null ? "" : e.DepartmentName;
        return e;
    }

    $scope.getStatus = function (id) {
        var e = Enumerable.From($scope.data.Status).Where(function (x) { return x.Id == id }).FirstOrDefault();
        e = e == null ? "" : e.StatusName;
        return e;
    }

    $scope.getTicketDescription = function (tid) {
        var e = Enumerable.From($scope.data.Ticket).Where(function (x) { return x.Id == tid }).FirstOrDefault();
        e = e == null ? "" : e.Description;
        return e;
    }

    $scope.ticketsByDomain = function (item) {
        return (item.Domain == $scope.currentUser.Domain && item.Status!=4);
    }

    $scope.ticketsByUser = function (item) {
        return item.UserID == $scope.currentUser.Id;
    }
      
    $scope.openTicketWindow = function (x) {
        $scope.selectedTicket = angular.copy(x);
        $scope.selectedTicket["oldStatus"] = x.Status;
        $scope.selectedTicket["Location"] = x.Building + " " + x.Room;

        //$scope.selectedTicket.idTicket = x.idTicket;
        //$scope.selectedTicket.Owner = x.DisplayName;
        //$scope.selectedTicket.timeopen = x.TimeOpen;
        //$scope.selectedTicket.des = x.Description;
        //$scope.selectedTicket.build = x.Building;
        //$scope.selectedTicket.room = x.Room;
        //$scope.selectedTicket.location = $scope.selectedTicket.build + "" + $scope.selectedTicket.room;
        //$scope.selectedTicket.status = x.Status;
        //$scope.selectedTicket.oldStatus = x.Status;
        //$scope.tmp = Enumerable.From($scope.data.Task).Where(function (j) { return j.idTicket == $scope.selectedTicket.idTicket }).ToArray();
        //$scope.ticketTasks = angular.copy($scope.tmp);
        $('#editTicketModal').modal('show');
    }

    $scope.getTicketTasks = function (tid) {
        var a = Enumerable.From($scope.data.Task).Where(function (j) { return j.TicketID == $scope.selectedTicket.TicketID }).ToArray();
        return a;
    }

    $scope.calculateData = function (list)
    {

            
    }

    $scope.isHomeTab = function () {
        return ['createTicket', 'MyTicket', 'TicketsToDo', 'Search'].indexOf($scope.currentPage) > -1;
    }

    $scope.setPage = function (n) {
        $scope.currentPage = n;
        $scope.currPage=1;
        switch(n)
        {
            case 'MyTicket':
                var myTickets = ($scope.data.MyTickets).filter(function (item) {
                    return item.idUser == $scope.currentUser.Id
                })
                $scope.dataLength = myTickets.length;
                break;
            case 'TicketsToDo':
                var myTickets = ($scope.data.TicketsToDo).filter(function (item) {
                    return (item.Domain == $scope.currentUser.Domain && item.Status!='סגורה')
                })
                $scope.dataLength = myTickets.length;
                break;
            case 'Reports':
                $scope.currentPage = 'Reports';
                break;
            case 'ManageUsers':
                $scope.currentPage = 'ManageUsers';
                $scope.dataLength = $scope.data.User.length;
                break;
        }
        $scope.noOfPages = Math.ceil($scope.dataLength / $scope.pageSize);

    }

    //go to next page
    $scope.nextP = function () {
        $scope.currPage = $scope.currPage + 1;
        $scope.safeApply();
    }

    //go to previous page
    $scope.prevP = function () {

        $scope.currPage = $scope.currPage - 1;
        $scope.safeApply();


    }

    //disable button if there in no next page
    $scope.DisableNextPage = function () {
        return $scope.currPage == $scope.pageCount() ? "disabled" : "";
    };

    //disable button if there in no previous page
    $scope.DisablePrevPage = function () {
        return $scope.currPage == 0 ? "disabled" : "";
    };

    //count number of pages
    $scope.pageCount = function () {
        return Math.ceil($scope.dataLength / $scope.pageSize) - 1;
    };

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

           

        })


app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});