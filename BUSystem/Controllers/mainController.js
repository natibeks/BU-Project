var app = angular.module('myApp', ['moment-picker', "ng-fusioncharts"])
        .controller('myController', function ($scope, $http, $timeout, $filter, $window) {

            app.expandTicketController($scope, $http, $timeout, $filter);
            app.expandSearchController($scope, $http, $timeout, $filter);
            app.expandReportsController($scope, $http, $timeout, $filter, $window);

            $scope.pageConfig = PageConfig;

            $scope.currentUser = {
                Id: 0,
                Type: null,
                Password: null,
                Permission: null,
                Department: "",
                FullName: "",
                EMail: "",
                Tel: "",
                Domain: ""
            };

            $scope.pageSize = 10;
            $scope.dataLength;
            $scope.noOfPages;
            $scope.currPage = 1;

            $scope.tempUser = 0;

            $scope.currentPage = 'main';
            $scope.appMenu = AppMenu;
            $scope.data = null;
            $scope.sort = { Name: 'Id', Desc: true };
      
            angular.element(document).ready(function () {
                if (typeof ($scope.UserId) == 'undefined') return;
                var url = "Tasks.aspx?tp=GetInitData";
                $http.get(url, null).then(
                    function (d) {
                        $scope.data = angular.copy(d.data);
                        console.log($scope.data);
                        $scope.tempUser = Enumerable.From($scope.data.User).Where(function (j) { return j.uid == $scope.UserId }).FirstOrDefault();
                        $scope.currentUser.Id = $scope.tempUser.uid;
                        $scope.currentUser.Permission = $scope.tempUser.Role;
                        $scope.currentUser.Department = $scope.tempUser.Department;
                        $scope.currentUser.FullName = $scope.tempUser.DisplayName;
                        $scope.currentUser.EMail = $scope.tempUser.EmailAddress;
                        $scope.currentUser.Tel = $scope.tempUser.TelephoneNumber;
                        $scope.currentUser.Domain = Enumerable.From($scope.data.Employee).Where(function (j) { return j.idEmployee == $scope.UserId }).Select(function (i) { return i.Domain}).FirstOrDefault();
                        if ($scope.currentUser.Permission==1)
                            $('#btn-my').click();
                        $scope.setPage('MyTicket');
                        $scope.updateEmployeeTable();
                    },
                    function (e) {
                    }
                    )
            })
            $scope.updateEmployeeTable = function () {
                $.each($scope.data.Employee, function (i, o) {
                    $scope.data.Employee[i]["Name"] = Enumerable.From($scope.data.User).Where(function (j) { return j.uid == o.idEmployee }).Select('$.DisplayName').FirstOrDefault();
                })
            }

           


            $scope.ticketsByDomain = function (item) {
                return (item.Domain == $scope.currentUser.Domain && item.Status!="סגורה");
            }
      
            $scope.openTicketWindow = function (x) {

                $scope.selectedTicket.idTicket = angular.copy(x.idTicket);
                $scope.selectedTicket.Owner = angular.copy(x.DisplayName);
                $scope.selectedTicket.timeopen = angular.copy(x.TimeOpen);
                $scope.selectedTicket.des = angular.copy(x.Description);
                $scope.selectedTicket.build = angular.copy(x.Building);
                $scope.selectedTicket.room = angular.copy(x.Room);
                $scope.selectedTicket.location = $scope.selectedTicket.build + "" + $scope.selectedTicket.room;
                $scope.selectedTicket.status = angular.copy(x.Status);
                $scope.oldStatus = angular.copy(x.Status);
                $scope.tmp = Enumerable.From($scope.data.Task).Where(function (j) { return j.idTicket == $scope.selectedTicket.idTicket }).ToArray();
                $scope.ticketTasks = angular.copy($scope.tmp);
                $('#editTicketModal').modal('show');
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