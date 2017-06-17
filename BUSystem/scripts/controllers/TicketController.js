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

    $scope.openTicketWindow = function (x) {
        $scope.selectedTicket = angular.copy(x);
        $scope.selectedTicket.Id = x.TicketID;
        $scope.selectedTicket["oldStatus"] = x.Status;
        $scope.selectedTicket["DomainID"] = $scope.getDomainByCategory(x.CategoryID);
        //$scope.selectedTicket.Department = $scope.currentUser.Department;
        $scope.updateTaskCounter();
        $scope.taskEditMode = false;
        $('#editTicketModal').modal('show');
    }

    $scope.updateTaskCounter = function () {
        $scope.taskCounter = Enumerable.From($scope.data.Task).Where(function (x) { return x.TicketID == $scope.selectedTicket.Id }).Count();
    }

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
                if (!$scope.isAllTasksDone()) {
                    $scope.msg = "  לא ניתן לסגור פניה";
                    $("#ShowErrorMsg").modal('show');
                    $scope.error = true;

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

    $scope.deleteTicket = function () {
        url = "Tasks.aspx?tp=delTicket";
        DataService.makeGetRequest(url, { task: $scope.selectedTicket }).then(
            function (response) {
                if (!response.RequestSucceed) return; {//is tasks were deleted from DB
                    $scope.error = false;
                    angular.forEach($scope.data.Ticket, function (o, i) {
                        if (o.Id == $scope.selectedTicket.Id)
                            $scope.data.Ticket[i].IsArchive = true;
                    })
                    angular.forEach($scope.data.Task, function (o, i) {
                        if (o.TicketID == $scope.selectedTicket.Id)
                            $scope.data.Task[i].IsArchive = true;
                    })
                    $scope.setPage($scope.currentPage);
                    $("#editTicketModal").modal('hide');
                }
            })
    };

    $scope.confirmDelete = function (x) {
        $scope.selectedTask.idTask = angular.copy(x.idTask);
        $scope.selectedTask.idTicket = angular.copy(x.idTicket);
        $scope.selectedTask.TaskDescription = angular.copy(x.TaskDescription);
        $scope.selectedTask.Done = angular.copy(x.Done);

        $('#confirmDeleteModal').modal('show');
    }

    $scope.setTaskEditMode = function (o) {
        $scope.taskEditMode = true;
        $scope.initSelectedTask(o);
    }

    $scope.unsetTaskEditMode = function () {
        $scope.taskEditMode = !$scope.taskEditMode;

    }

    $scope.initSelectedTask = function (o) {
        if (o == undefined){
            $scope.selectedTask = angular.copy($scope.taskTemplate);
            $scope.selectedTask.TicketID = $scope.selectedTicket.Id;
        }
        else
            $scope.selectedTask = angular.copy(o);

    }

    $scope.setTaskAsChecked = function (tid) {
        DataService.makeGetRequest("Tasks.aspx?tp=checkTask", { TaskID: tid}).then(
        function (response) {
            if (!response.RequestSucceed) {
                angular.forEach($scope.data.Task, function (o, i) {
                    if ($scope.data.Task[i].Id == id)
                        $scope.data.Task[i].Done = !$scope.data.Task[i].Done;
                })
            }
    });
    }

    $scope.updateTask = function () {
        var isNew = $scope.selectedTask.Id == 0;
        var url = "Tasks.aspx?tp=addTask";
        DataService.makePostRequest(url, $scope.selectedTask).then(
            function (response) {
                if (!response.RequestSucceed) return;
                if(isNew){
                    var id = parseInt(response.Data);
                    $scope.selectedTask.Id = id;
                    $scope.data.Task.push($scope.selectedTask);
                }                  
                else
                    angular.forEach($scope.data.Task, function (o, i) {
                        if ($scope.data.Task[i].Id == id)
                            $scope.data.Task[i] = angular.copy($scope.selectedTask);
                    })
                $scope.updateTaskCounter();
                $scope.taskEditMode = false;
                $('.nav-tabs a[href="#taskToDo"]').tab('show');
                $scope.error = false;
            });
    }

    $scope.deleteTask = function () {
        url = "Tasks.aspx?tp=delTask";
        DataService.makeGetRequest(url, { task: $scope.selectedTask.Id }).then(
            function (response) {
                if (!response.RequestSucceed) return; {//is tasks were deleted from DB
                    $scope.error = false;
                    $scope.msg = 'המשימה נמחקה';
                    angular.forEach($scope.data.Task, function (o, i) {
                        if (o.Id == $scope.selectedTask.Id)
                            $scope.data.Task[i].IsArchive = true;
                    })
                    $scope.taskEditMode = false;
                    $scope.updateTaskCounter();
                }
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

    $scope.isAllTasksDone = function () {
        var cnt = Enumerable.From($scope.data.Task).Where(function (x) { return x.TicketID == $scope.selectedTicket.Id && x.Done == false; }).Count();
        return cnt > 0;
    }

    $scope.getTicketClass = function (t) {
        if (moment(t.TimeOpen, "DD-MM-YYYY HH:mm").diff(moment(), "hours") < 24)
            return "warning";

        if (moment(t.TimeClose, "DD-MM-YYYY HH:mm").diff(moment(), "days") > 0)
            return "info";

        if (moment(t.TimeClose, "DD-MM-YYYY HH:mm").diff(moment(), "days") > 0)
            return "danger";
    }

    $scope.resetFields = function () {
        $scope.selectedTicket = angular.copy($scop.ticketTemplate);

    }

    $scope.error = false;
    $scope.msg = "";
    $scope.totalCount = 0;
    $scope.countInit = function () {
        return $scope.totalCount++;
    }

}
