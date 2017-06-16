app.expandTicketController = function ($scope, DataService, $timeout, $filter) {

    $scope.ticketTemplate = {
        Id: 0,
        TimeOpen: moment().toDate(),
        Date: moment().add(1, 'days'),
        Description: "",
        Status: 1,
        UserID: $scope.UserId,
        AnotherAsignee: 0,
        CategoryID: "",
        DomainID: "",
        Location: "",
        Priority: false
    };

    $scope.taskTemplate = {
        Id: 0,
        TicketID: 0,
        TaskDescription: "",
        Done: false
    };

    $scope.getTicketTasks = function (tid) {
        var a = Enumerable.From($scope.data.Task).Where(function (j) { return j.TicketID == $scope.selectedTicket.TicketID }).ToArray();
        return a;
    }

    $scope.addNewTicketToMyTicket = function () {
        var lastTicket = $scope.data.Ticket[$scope.data.Ticket.length - 1];
        var temp = {};
        temp['DomainID'] = Enumerable.From($scope.data.Category).Where(function (x) { return lastTicket.CategoryID == x.Id }).Select(function (y) { return y.DomainID }).FirstOrDefault();
        temp['TicketID'] = lastTicket.Id;
        temp['UserID'] = $scope.currentUser.Id;
        temp['MainUser'] = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.UserID == $scope.currentUser.Id && x.TicketID == lastTicket.Id }).Select(function (y) { return y.MainUser }).FirstOrDefault();
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
            return $scope.currentUser.Domains.indexOf(TicketDomain) > -1;
        }).ToArray();
        var ttd = [];
        angular.forEach(s, function (o, i) {
            var temp = {};
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

    $scope.initNewTicket = function () {
        $scope.selectedTicket = angular.copy($scope.ticketTemplate);
        $scope.selectedTicket.UserID = $scope.currentUser.Id;
        $scope.selectedTicket.DomainID = $scope.currentUser.Domains[0];

    }

    $scope.addNewTicket = function () {

        if (!moment($scope.selectedTicket.Date, 'DD-MM-YYYY').isValid()) {
            $scope.error = true;
            $scope.msg = "אנא בחר תאריך לביצוע";
            $('#ShowErrorMsg').modal('show');

        }
        if ($scope.selectedTicket.DomainID == 1 && ($scope.selectedTicket.CategoryID == "" ||
            ($scope.selectedTicket.LocationID == "" && $scope.selectedTicket.DomainID == 1) ||
            $scope.selectedTicket.Description == "")) {
            $scope.error = true;
            $scope.msg = "אנא מלא את כל השדות.";
            $('#ShowErrorMsg').modal('show');
        }
        else if ($scope.selectedTicket.DomainID != 'תחזוקה' && ($scope.selectedTicket.CategoryID == 0 || $scope.selectedTicket.Description == "")) {
            $scope.error = true;
            $scope.msg = "אנא מלא את כל השדות.";
            $('#ShowErrorMsg').modal('show');
        }
        else {
            DataService.makePostRequest("Tasks.aspx?tp=addNewTicket", $scope.selectedTicket).then(
                function (response) {
                    if (!response.RequestSucceed) return;
                    var Id = parseInt(response.Data);
                    $scope.selectedTicket.Id = Id;
                    $scope.data.Ticket.push(angular.copy($scope.selectedTicket));

                    var temp2 = {
                        TicketID: Id,
                        UserID: $scope.selectedTicket.UserID,
                        MainUser: true
                    }
                    $scope.data.UserTicket.push(temp2);
                    $scope.addNewTicketToMyTicket();
                    $scope.error = false;
                    $('#confirmOpenTicketModal').modal('show');
                    $scope.resetFields();

                })
        }

    };

    $scope.updateTicket = function () {
        var url = "Tasks.aspx?tp=updateTicket";
        var u = angular.copy($scope.selectedTicket);
        u['tasks'] = $scope.checkTicketTaskUpdate();

        if (u.Status == 4) {
            if ($scope.selectedTicket.oldStatus == 3 || $scope.selectedTicket.oldStatus == 2) {
                if (!$scope.AllTasksDone($scope.data.Task)) {
                    $scope.msg = "  לא ניתן לסגור פניה";
                    $scope.error = true;
                    $timeout(function () {
                        $scope.msg = "";
                        $('#confirmDeleteModal').modal('hide');
                    }, 2500);

                }
                //to display confirmation
            }
        }
        DataService.makePostRequest(url, u).then(
            function (d) {
                if (!response.RequestSucceed) return;
                $.each($scope.data.Ticket, function (i, o) {
                    if (o.Id == $scope.selectedTicket.Id)
                        $scope.data.Ticket[i] = angular.copy($scope.selectedTicket);
                })
                var newAnotherAsignee = $scope.selectedTicket.AnotherAsignee > 0;
                if (newAnotherAsignee) {
                    var isFound = false;
                    $.each($scope.data.UserTicket, function (i, o) {
                        if (o.TicketID == $scope.selectedTicket.Id && o.MainUser == false) {
                            $scope.data.UserTicket[i].UserID = $scope.selectedTicket.AnotherAsignee;
                            isFound = true;
                        }
                    })
                    if (!isFound)
                        $scope.data.UserTicket.push({
                            TicketID: $scope.selectedTicket.Id,
                            UserID: $scope.selectedTicket.UserID,
                            MainUser: false
                        })
                }
                $scope.updateExistingTicketOfMyTicket();
                $scope.setPage($scope.currentPage);

                $('#editTicketModal').modal('hide');
                $scope.error = false;

            });
    }

    $scope.confirmDelete = function (x) {
        $scope.selectedTask.idTask = angular.copy(x.idTask);
        $scope.selectedTask.idTicket = angular.copy(x.idTicket);
        $scope.selectedTask.TaskDescription = angular.copy(x.TaskDescription);
        $scope.selectedTask.Done = angular.copy(x.Done);

        $('#confirmDeleteModal').modal('show');
    }

    $scope.displayNewTask = false;

    $scope.addTask = function () {
        $scope.displayNewTask = true;
    }

    $scope.updateTask = function () {
        var url = "Tasks.aspx?tp=addTask";
        DataService.makePostRequest(url, $scope.selectedTicket).then(
            function (response) {
                if (!response.RequestSucceed) return;
                var id = parseInt(response.Data);
                $scope.selectedTicket.Id = id;
                $scope.data.Task.push($scope.selectedTicket);
                $scope.displayNewTask = false;
                $scope.error = false;
            });
    }

    $scope.deleteTask = function () {
        url = "Tasks.aspx?tp=delTask";
        DataService.makePostRequest(url, $scope.selectedTicket).then(function (response) {
            if (!response.RequestSucceed) return; {//is tasks were deleted from DB
                $scope.error = false;
                $scope.msg = 'Deleting Succeeded'

                $timeout(function () {
                    $scope.msg = "";
                    $('#confirmDeleteModal').modal('hide');
                }, 2500);
            }
            //else {//if deleting failed
            //    $scope.error = true;
            //    $scope.msg = 'Something went wrong'

            //    $timeout(function () {
            //        $scope.msg = "";
            //        $('#confirmDeleteModal').modal('hide');
            //    }, 2500);
            //}
            $scope.safeApply();
        })
    };

    $scope.checkTicketTaskUpdate = function () {
        var temp = [];
        $.each($scope.ticketTasks, function (i, o) {
            $.each($scope.data.Task, function (j, k) {
                if (o.TaskID == k.Id) {
                    if (o.Done != k.Done)
                        temp.push(k);
                }
            })
        })
        return temp;
    }

    $scope.AllTasksDone = function (tasks) {
        var done = true;
        $.each(tasks, function (i, o) {
            if (!o.Done && o.TicketID == $scope.selectedTicket.Id)
                done = false;
        })
        return done;
    }

    $scope.resetFields = function () {
        $scope.selectedTicket = angular.copy($scop.ticketTemplate);

    }

    $scope.error = true;
    $scope.msg = "";
    $scope.totalCount = 0;
    $scope.countInit = function () {
        return $scope.totalCount++;
    }

}
}
