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

    $scope.openTicketWindow = function (x) {
        $scope.selectedTicket = angular.copy(x);
        $scope.selectedTicket.Id = x.TicketID;
        $scope.selectedTicket["oldStatus"] = x.Status;
        $scope.selectedTicket["DomainID"] = $scope.getDomainByCategory(x.CategoryID);
        //$scope.selectedTicket.Department = $scope.currentUser.Department;

        $('#editTicketModal').modal('show');
    }

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
