app.expandTicketController = function ($scope, $http, $timeout, $filter) {

    $scope.ticketTemplate = {
        TicketID: 0,
        UserID: 0,
        TimeOpen: moment().toDate(),
        Description: "",
        Building: "",
        Room: "",
        Status: 1,
        EmploeeID: "",
        AnotherAsignee: "",
        CategoryID: 0,
        DomainID: 0
    };

    $scope.taskTemplate = {
        TaskID: 0,
        TicketID: 0,
        TaskDescription: "",
        Done: false
    };

    $scope.error = true;

    $scope.msg = "";

    $scope.totalCount = 0;
    $scope.countInit = function () {
        return $scope.totalCount++;
    }

    $scope.confirmDelete = function (x) {
        $scope.selectedTask.idTask = angular.copy(x.idTask);
        $scope.selectedTask.idTicket = angular.copy(x.idTicket);
        $scope.selectedTask.TaskDescription = angular.copy(x.TaskDescription);
        $scope.selectedTask.Done = angular.copy(x.Done);

        $('#confirmDeleteModal').modal('show');
    }

    $scope.filterTasks = function (item) {
        return item.TicketID == $scope.selectedTicket.TicketID;
    }
    $scope.CategoryFilter = function (item) {
        return item.Domain == $scope.currentUser.Domain;
    };

    $scope.domainByUser = function (item) {
        return $scope.currentUser.Domains.indexOf(item.Id) > -1;
    }

    $scope.empFilter = function (item) {
        if ($scope.selectedTicket.emp == "")
            return false;
        else
            return $scope.selectedTicket.emp == item.DisplayName;
    };
    $scope.asigneeFilter = function (item) {
        return $scope.currentUser.Id != item.EmploeeID && item.Domain == $scope.currentUser.Domain;
    };

    $scope.RoomFilter = function (item) {
        if ($scope.newTicket.Build == "")
            return false;
        else
            return $scope.newTicket.Build == item.Building;
    };
    $scope.displayNewTask = false;

    $scope.addTask = function () {
        $scope.displayNewTask = true;

    }
    $scope.updateTask = function () {
        url = "Tasks.aspx?tp=addTask";
        $scope.NewTask.idTicket = $scope.selectedTicket.idTicket;
        $http.post(url, $scope.NewTask, null).then(
            function (d) {
                var ID = parseInt(d.data);
                $scope.NewTask.idTask = ID;
                $scope.data.Task.push($scope.NewTask);
                $scope.displayNewTask = false;
                $scope.error = false;
            },
            function (e) {
                console.log(e);
                $scope.error = true;
            }
            )

    };

    $scope.DeleteTask = function () {
        url = "Tasks.aspx?tp=delTask";
        $http.post(url, $scope.selectedTask, null).then(
                function (d) {
                    if (d.data == "Ok") {//is tasks were deleted from DB

                        $scope.error = false;
                        $scope.msg = 'Deleting Succeeded'

                        $timeout(function () {
                            $scope.msg = "";
                            $('#confirmDeleteModal').modal('hide');
                        }, 2500);
                    }
                    else {//if deleting failed
                        $scope.error = true;
                        $scope.msg = 'Something went wrong'

                        $timeout(function () {
                            $scope.msg = "";
                            $('#confirmDeleteModal').modal('hide');
                        }, 2500);

                    }

                    $scope.safeApply();
                },
                function (e) {
                    $scope.error = true;
                    $scope.msg = 'Deleting failed'

                    $timeout(function () {
                        $scope.msg = "";
                        $('#confirmDeleteModal').modal('hide');
                    }, 2500);

                }
            )
    };
    $scope.checkTicketTaskUpdate = function () {
        var temp = [];
        $.each($scope.ticketTasks, function (i, o) {
            $.each($scope.data.Task, function (j, k) {
                if (o.idTask == k.idTask) {
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
            if (!o.Done && o.idTicket == $scope.selectedTicket.idTicket)
                done = false;
        })
        return done;
    }

    $scope.updateTicket = function () {
        url = "Tasks.aspx?tp=updateTicket";
        $scope.selectedTicket.idEmployee = $scope.currentUser.Id;
        var u = angular.copy($scope.selectedTicket);
        u['tasks'] = $scope.checkTicketTaskUpdate();

        if (u.Status == 'סגורה') {
            if ($scope.selectedTicket.oldStatus == 'ממתין' || $scope.selectedTicket.oldStatus == 'משויכת') {
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

        $http.post(url, u, null).then(
            function (d) {
                if (d.data == 'OK') {

                    $.each($scope.data.Ticket, function (i, o) {
                        if (o.idTicket == $scope.selectedTicket.idTicket)
                            $scope.data.Ticket[i] = angular.copy($scope.selectedTicket);
                    })
                    $scope.setPage($scope.currentPage);


                    $('#editTicketModal').modal('hide');
                    $scope.error = false;
                }
            },
            function (e) {
                console.log(e);
                $scope.error = true;
            }
            )

    };

    $scope.addNewTicket = function () {
        url = "Tasks.aspx?tp=addNewTicket";
        var u = angular.copy($scope.newTicket);

        var today = new Date();
        var d = moment().format('DD-MM-YYYY');

        if ($scope.newTicket.DateToDo != "" && $scope.newTicket.DateToDo < d) {
            $scope.error = true;
            $scope.msg = "אנא בחר תאריך לביצוע מאוחר יותר מהתאריך של היום.";
            $('#ShowErrorMsg').modal('show');

        }
       if ($scope.newTicket.Domain == 'תחזוקה' && ($scope.newTicket.idCategory == 0 || $scope.newTicket.Build == "" || $scope.newTicket.idLocation == 0 ||
         $scope.newTicket.Description == "")) {
                $scope.error = true;
                $scope.msg = "אנא מלא את כל השדות.";
                $('#ShowErrorMsg').modal('show');
            }
            else if ($scope.newTicket.Domain != 'תחזוקה' && ($scope.newTicket.idCategory == 0 || $scope.newTicket.Description == "")) {
                $scope.error = true;
                $scope.msg = "אנא מלא את כל השדות.";
                $('#ShowErrorMsg').modal('show');
            }

            else {
                u.Owner = $scope.currentUser.Id;
                $http.post(url, u, null).then(
                    function (d) {
                        var ID = parseInt(d.data);
                        var temp1 = {
                            idTicket: ID,
                            idCategory: u.idCategory,
                            idLocation: u.idLocation,
                            Priority: u.Priority,
                            Description: u.Description,
                            Status: "פתוחה",
                            Image: 0
                        }
                        $scope.data.Ticket.push(temp1);

                        var temp2 = {
                            idTicket: parseInt(d.data),
                            idUser: u.Owner,
                            idEmployee: 0,
                            TimeOpen: moment().format('dd/mm/yyyy hh:mm'),
                            TimeClose: 0,
                            AnotherAssignee: 0,
                            Domain: u.Domain
                        }
                        $scope.data.TicketsForEmployee.push(temp2);


                        $scope.error = false;
                        $('#confirmOpenTicketModal').modal('show');
                        $scope.resetFields();

                    }
                    , function (e) {
                        console.log(e);
                        $scope.error = true;
                    }
                    )
            }

    };

    $scope.resetFields = function () {
        $scope.newTicket.Domain = "";
        $scope.newTicket.Description = "";
        $scope.newTicket.Priority = 0;
        $scope.newTicket.DateToDo = "";
        $scope.error = "";
    }

}
