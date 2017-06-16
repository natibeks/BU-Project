app.controller('myController', function ($scope, $http, $timeout, $filter, $window, DataService) {

    app.expandTicketController($scope, DataService, $timeout, $filter);
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
            if (!response.RequestSucceed) return;
            $scope.data = angular.copy(response.Data);
            console.log($scope.data);
            //$scope.prepareData();
            $scope.initUserValues();
            $scope.loaded = true;
            //$scope.updateEmployeeTable();
        });
    })
    //$scope.updateEmployeeTable = function () {
    //    $.each($scope.data.Employee, function (i, o) {
    //        $scope.data.Employee[i]["Name"] = Enumerable.From($scope.data.User).Where(function (j) { return j.Id == o.idEmployee }).Select('$.DisplayName').FirstOrDefault();
    //    })
    //}

    $scope.initUserValues = function () {
        $scope.currentUser = Enumerable.From($scope.data.User).Where(function (j) { return j.Id == $scope.UserId }).FirstOrDefault();
        $scope.currentUser["Permission"] = $scope.currentUser.Role;
        $scope.currentUser.Domains = Enumerable.From($scope.data.UserDomain).Where(function (j) { return j.UserID == $scope.currentUser.Id }).Select(function (i) { return i.DomainID }).ToArray();
        //$scope.currentUser.DomainName = Enumerable.From($scope.data.Domain).Where(function (j) { return j.Id == $scope.currentUser.DomainID }).Select(function (i) { return i.DomainName }).FirstOrDefault();
    }

    $scope.setSort = function (c) {
        $scope.sort.Name = c;
        $scope.sort.Desc = !$scope.sort.Desc;
    }

    $scope.isHomeTab = function () {
        return ['createTicket', 'MyTicket', 'TicketsToDo', 'Search'].indexOf($scope.currentPage) > -1;
    }

    //getters

    $scope.getDomainByCategory = function (cid) {
        return Enumerable.From($scope.data.Category).Where(function (j) { return j.Id == cid }).Select(function (y) { return y.DomainID }).FirstOrDefault();
    }

    $scope.getTicketTasks = function (tid) {
        var a = Enumerable.From($scope.data.Task).Where(function (j) { return j.TicketID == $scope.selectedTicket.TicketID }).ToArray();
        return a;
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

    //filters

    $scope.ticketsByDomain = function (item) {
        return ($scope.currentUser.Domains.indexOf(item.Domain) > -1 && item.Status != 4);
    }

    $scope.domainByUser = function (item) {
        return $scope.currentUser.Domains.indexOf(item.Id) > -1;
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
        if ($scope.currentUser.Permission == 0) return true;
        return $scope.currentUser.Department == item.Id;
    }

    $scope.filterTasks = function (item) {
        return item.TicketID == $scope.selectedTicket.TicketID;
    }

    $scope.categoryFilter = function (item) {
        return item.DomainID == $scope.selectedTicket.DomainID;
    };

    //Functions

    $scope.addNewTicketToMyTicket = function () {
        var lastTicket = $scope.data.Ticket[$scope.data.Ticket.length-1];
        var temp = {};
        temp['DomainID'] = Enumerable.From($scope.data.Category).Where(function (x) { return lastTicket.CategoryID == x.Id }).Select(function(y) { return y.DomainID }).FirstOrDefault();
        temp['TicketID'] = lastTicket.Id;
        temp['UserID'] = $scope.currentUser.Id;
        temp['MainUser'] = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.UserID == $scope.currentUser.Id && x.TicketID == lastTicket.Id }).Select(function(y) { return y.MainUser }).FirstOrDefault();
        temp['TimeClose'] = lastTicket.TimeClose;
        temp['TimeOpen'] = lastTicket.TimeOpen;
        temp['Status'] = lastTicket.Status;
        temp['Priority'] = lastTicket.Priority;
        temp['LocationID'] = lastTicket.LocationID;
        temp['Description'] = lastTicket.Description;
        temp['CategoryID'] = lastTicket.CategoryID;
        temp['AnotherAsignee'] = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.MainUser == false && x.TicketID == lastTicket.Id }).Select(function (y) { return y.UserID }).FirstOrDefault();
        $scope.data.MyTickets.push(temp);
    }

    $scope.updateExistingTicketOfMyTicket = function (tid) {
        var lastTicket = Enumerable.From($scope.data.Ticket).Where(function (x) { return tid == x.Id }).FirstOrDefault();
        angular.forEach($scope.data.MyTicket, function (i, o) {
            if (o.TicketID == tid) {
                $scope.data.MyTicket[i]['DomainID'] = Enumerable.From($scope.data.Category).Where(function (x) { return lastTicket.CategoryID == x.Id }).Select(function (y) { return y.DomainID }).FirstOrDefault();
                $scope.data.MyTicket[i]['TicketID'] = lastTicket.Id;
                $scope.data.MyTicket[i]['UserID'] = $scope.currentUser.Id;
                $scope.data.MyTicket[i]['MainUser'] = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.UserID == $scope.currentUser.Id && x.TicketID == lastTicket.Id }).Select(function (y) { return y.MainUser }).FirstOrDefault();
                $scope.data.MyTicket[i]['TimeClose'] = lastTicket.TimeClose;
                $scope.data.MyTicket[i]['TimeOpen'] = lastTicket.TimeOpen;
                $scope.data.MyTicket[i]['Status'] = lastTicket.Status;
                $scope.data.MyTicket[i]['Priority'] = lastTicket.Priority;
                $scope.data.MyTicket[i]['LocationID'] = lastTicket.LocationID;
                $scope.data.MyTicket[i]['Description'] = lastTicket.Description;
                $scope.data.MyTicket[i]['CategoryID'] = lastTicket.CategoryID;
                $scope.data.MyTicket[i]['AnotherAsignee'] = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.MainUser == false && x.TicketID == lastTicket.Id }).Select(function (y) { return y.UserID }).FirstOrDefault();

            }

        })
    }

    $scope.createTicketsToDo = function () {
        var s = Enumerable.From($scope.data.Ticket).Where(function (x) {
            var TicketDomain = $scope.getDomainByCategory(x.CategoryID);
            return $scope.currentUser.Domains.indexOf(TicketDomain)>-1;
        }).ToArray();
        var ttd=[];
        angular.forEach(s,function(o,i){
            var temp={};
            temp["TicketID"] = o.Id;
            temp["LocationID"] = o.LocationID;
            temp['Description'] = o.Description;
            temp['CategoryID'] = o.CategoryID;
            temp['TimeClose'] = o.TimeClose;
            temp['TimeOpen'] = o.TimeOpen;
            temp['Status'] = o.Status;
            temp['UserID'] = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.MainUser == true && x.TicketID == o.Id }).Select(function (y) { return y.UserID }).FirstOrDefault();
            temp['AnotherAsignee'] = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.MainUser == false && x.TicketID == x.TicketID.Id }).Select(function (y) { return y.UserID }).FirstOrDefault();
            ttd.push(temp);
        });
        $scope.data.TicketsToDo = angular.copy(ttd);
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

app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});