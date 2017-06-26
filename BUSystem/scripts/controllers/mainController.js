app.controller('myController', function ($scope, $http, $timeout, $filter, $window, DataService) {

    app.expandTicketController($scope, DataService, $timeout, $filter);
    app.expandSearchController($scope, $http, $timeout, $filter);
    app.expandReportsController($scope, $http, $timeout, $filter, $window);
    app.expandUserController($scope, DataService);

    $scope.pageConfig = PageConfig;
    $scope.pageSize = 10;
    $scope.dataLength;
    $scope.noOfPages;
    $scope.currPage = 1;
    $scope.appMenu = AppMenu;
    $scope.sort = { Name: 'Id', Desc: false };

    angular.element(document).ready(function () {
        if (typeof ($scope.UserId) == 'undefined') return;
        var isAdmin = $scope.UserLevel == 0;
        var url = "Tasks.aspx?tp=GetInitData";
        DataService.getAll($scope.UserId, isAdmin).then(function (response) {
            if (!response.RequestSucceed) return;
            $scope.data = angular.copy(response.Data);
            console.log($scope.data);
            $scope.initUserValues();
            $scope.setPage('MyTicket');
            $scope.loaded = true;
        });
    })

    // Init currentUser object and create his TicketsToDo Table
    $scope.initUserValues = function () {
        $scope.currentUser = Enumerable.From($scope.data.User).Where(function (j) { return j.Id == $scope.UserId }).FirstOrDefault();
        $scope.currentUser["Permission"] = $scope.currentUser.Role;
        $scope.currentUser.Domains = Enumerable.From($scope.data.UserDomain).Where(function (j) { return j.UserID == $scope.currentUser.Id }).Select(function (i) { return i.DomainID }).ToArray();
        $scope.createTicketsToDo();
    }

    $scope.setSort = function (c) {
        $scope.sort.Name = c;
        $scope.sort.Desc = !$scope.sort.Desc;
    }

    $scope.isHomeTab = function () {
        return ['createTicket', 'MyTicket', 'TicketsToDo', 'Search'].indexOf($scope.currentPage) > -1;
    }

    //deleting config
    $scope.delType = 0;
    $scope.delConfirmed = function () {
        switch ($scope.delType) {
            case 1:
                $scope.deleteTicket();
                break;
            case 2:
                $scope.deleteTask();
                break;
            case 3:
                $scope.deleteUser();
                break;
        }
    }
    $scope.showDelConfirmMsg = function (dtype) {
        $scope.delType = dtype;
        $("#confirmDeleteModal").modal('show');
    }
    $scope.getDelObjectName = function () {
        if ($scope.delType == 0) return "";
        switch ($scope.delType) {
            case 1:
                return "פניה זו";
                break;
            case 2:
                return "משימה זו";
                break;
            case 3:
                return "משתמש זה";
                break;
        }
    }
    //getters

    $scope.getAsigneeNames = function (tid) {
        var ut = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.TicketID == item.Id }).Select(function (y) { return y.UserID }).ToArray();
        var unames = Enumerable.From($scope.data.User).Where(function (x) { return ut.indexOf(x.Id) > -1 }).Select(function (y) { return y.DisplayName }).ToArray();
        var res = "";

        if (typeof(unames[0])=="string")
            res = unames[0];
        
        if (typeof (unames[1]) == "string") {
            res = res + " ";
            res = unames[1];
        }
            
       
    }

    $scope.getDomainByCategory = function (cid) {
        return Enumerable.From($scope.data.Category).Where(function (j) { return j.Id == cid }).Select(function (y) { return y.DomainID }).FirstOrDefault();
    }

    $scope.isUserManagerOfThisCategory = function (cid) {
        var domain = $scope.getDomainByCategory(cid);
        var e = Enumerable.From($scope.data.UserDomain).Where(function (x) { return x.UserID == $scope.currentUser.Id && x.DomainID == domain }).FirstOrDefault();
        return e.IsManager == true;

    }

    $scope.isInBuilding = function (build, loc) {
        var e = Enumerable.From($scope.data.Location).Where(function (x) { return x.Id == loc }).FirstOrDefault();
        if (e == undefined) return false;
        return e.Building == build;
    }

    $scope.getUserDisplayName = function (uid) {
        if (uid == undefined) return;
        return Enumerable.From($scope.data.User).Where(function (x) { return x.Id == uid }).Select(function (y) { return y.DisplayName }).FirstOrDefault();
    }

    $scope.getLocationName = function (loc, flag) {
        if (loc == undefined) return;
        if (!flag)
            loc = Enumerable.From($scope.data.Location).Where(function (x) { return loc == x.Id }).FirstOrDefault();
        return loc.Building.toString() + ' ' + loc.Room + ' - ' + loc.Description;
    }

    $scope.getDepartment = function (id) {
        var e = Enumerable.From($scope.data.Department).Where(function (x) { return x.Id == id }).FirstOrDefault();
        e = e == null ? "" : e.DepartmentName;
        return e;
    }

    $scope.getCategory = function (id) {
        var e = Enumerable.From($scope.data.Category).Where(function (x) { return x.Id == id }).FirstOrDefault();
        e = e == null ? "" : e.CategoryName;
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
    
    $scope.getBuildingFromLocation = function (loc) {
        loc = Enumerable.From($scope.data.Location).Where(function (x) { return loc == x.Id }).FirstOrDefault();
        return loc.Building;
    }

    //filters

    $scope.ticketsByDomain = function (item) {
        return ($scope.currentUser.Domains.indexOf(item.Domain) > -1 && item.Status != 4);
    }

    $scope.domainByUser = function (item) {
        return $scope.currentUser.Domains.indexOf(item.Id) > -1;
    }

    $scope.isUserInManagerDomain = function (item) {
        var flag = false;
        var manDomain = Enumerable.From($scope.data.UserDomain).Where(function (j) { return j.UserID == $scope.currentUser.Id && j.IsManager}).Select(function (i) { return i.DomainID }).ToArray();
        var userDomain = Enumerable.From($scope.data.UserDomain).Where(function (j) { return j.UserID == $scope.currentUser.Id }).Select(function (i) { return i.DomainID }).ToArray();
        angular.forEach(manDomain, function (o, i) {
            angular.forEach(userDomain, function (p,j) {
                if (o == p) flag = true
            })
        })

        return flag;
    }



    $scope.asigneeFilter = function (item) {
        if ($scope.selectedTicket == undefined) return;
        var domains = Enumerable.From($scope.data.UserDomain).Where(function (x) { return x.UserID == item.Id }).Select(function (y) { return y.DomainID }).ToArray();
        return $scope.currentUser.Id != item.Id && domains.indexOf($scope.selectedTicket.DomainID) > -1;
    };

    $scope.ticketsByUser = function (item) {
        return item.UserID == $scope.currentUser.Id;
    }

    $scope.departmentFilter = function (item) {
        if ($scope.currentUser.Permission == 2) return true;
        return $scope.currentUser.Department == item.Id;
    }

    $scope.taskFilter = function (item) {
        return item.IsArchive != true && item.TicketID == $scope.selectedTicket.TicketID;
    }

    $scope.filterTasks = function (item) {
        return item.TicketID == $scope.selectedTicket.TicketID;
    }

    $scope.categoryFilter = function (item) {
        return item.DomainID == $scope.selectedTicket.DomainID;
    };

    $scope.CategoryToSearchFilter = function (item) {
        if ($scope.currentUser.Permission == 2)
            return $scope.currentUser.Domains.indexOf(item.DomainID) > -1;
        else
            return true;
    }

    //Paging

    $scope.setPage = function (n) {
        $scope.currentPage = n;
        $scope.currPage = 1;
        switch (n) {
            case 'MyTicket':
                var myTickets = ($scope.data.MyTickets).filter(function (item) {
                    return item.UserID == $scope.currentUser.Id
                })
                $scope.dataLength = myTickets.length;
                break;
            case 'TicketsToDo':
                $scope.createTicketsToDo();
                var myTickets = ($scope.data.TicketsToDo).filter(function (item) {
                    return (item.Status != 4)
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
            case 'createTicket':
                $scope.currentPage = 'createTicket';
                $scope.initNewTicket();
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
