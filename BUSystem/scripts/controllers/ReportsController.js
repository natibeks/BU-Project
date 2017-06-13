app.expandReportsController = function ($scope, $http, $timeout, $filter,$window) {
    
    $scope.toProduce = {
        status: false,
        category: false,
        emp: false,
        build: false,
        dept: false,
        From: "",
        To: ""
       
    }

    $scope.chartReady = false;
    $scope.countOpen = 0;
    $scope.countClose = 0;
    $scope.cat1 = 0;
    $scope.cat1 = 0;
    $scope.cat1 = 0;
    $scope.cat1 = 0;
    $scope.cat1 = 0;
    $scope.cat1 = 0;

    $(function () {
        $('.list-group.checked-list-box .list-group-item').each(function () {

            // Settings
            var $widget = $(this),
                $checkbox = $('<input type="checkbox" class="hidden" />'),
                color = ($widget.data('color') ? $widget.data('color') : "primary"),
                style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
                settings = {
                    on: {
                        icon: 'glyphicon glyphicon-check'
                    },
                    off: {
                        icon: 'glyphicon glyphicon-unchecked'
                    }
                };

            $widget.css('cursor', 'pointer')
            $widget.append($checkbox);

            // Event Handlers
            $widget.on('click', function () {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
                $checkbox.triggerHandler('change');
                updateDisplay();
            });
            $checkbox.on('change', function () {
                updateDisplay();
            });


            // Actions
            function updateDisplay() {
                var isChecked = $checkbox.is(':checked');

                // Set the button's state
                $widget.data('state', (isChecked) ? "on" : "off");

                // Set the button's icon
                $widget.find('.state-icon')
                    .removeClass()
                    .addClass('state-icon ' + settings[$widget.data('state')].icon);

                // Update the button's color
                if (isChecked) {
                    $widget.addClass(style + color + ' active');
                } else {
                    $widget.removeClass(style + color + ' active');
                }
            }

            // Initialization
            function init() {

                if ($widget.data('checked') == true) {
                    $checkbox.prop('checked', !$checkbox.is(':checked'));
                }

                updateDisplay();

                // Inject the icon if applicable
                if ($widget.find('.state-icon').length == 0) {
                    $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
                }
            }
            init();
        });

       
    });
    $scope.printReport = function () {

        var printContents = document.getElementById(divToPrint).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();

    }
 
    $scope.resetReport = function () {
        $scope.toProduce.status=false;
        $scope.toProduce.category= false;
        $scope.toProduce.emp=false;
        $scope.toProduce.build= false;
        $scope.toProduce.dept=false;
        $scope.toProduce.From = "";
        $scope.toProduce.To="";

        $scope.chartReady = false;
        $scope.countOpen = 0;
        $scope.countClose = 0;
        $scope.countCategory = 0;
    }

    $scope.produceReport = function () {
     
        if ($scope.toProduce.status == true) {
            if ($scope.currentUser.Permission != '4') { 
                $scope.cntOpen = Enumerable.From($scope.data.TicketsForEmployee).Where(function (i) {
                    var dateOpen = moment(i.TimeOpen, 'DD-MM-YYYY');
                    var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return i.Domain == $scope.currentUser.Domain && ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]')) || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) || (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))

                }).ToArray();

                $scope.cntClose = Enumerable.From($scope.data.TicketsForEmployee).Where(function (i) {
                    var dateClose = i.TimeClose == null ? null : moment(i.TimeClose, 'DD-MM-YYYY');
                    var f2 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t2 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return i.Domain == $scope.currentUser.Domain && dateClose != null && ((f2 == null && t2 == null) || (f2 != null && t2 != null && dateClose.isBetween(f2, t2, 'days', '[]')) || (f2 != null && t2 == null && dateClose.isSameOrAfter(f2)) || (t2 != null && f2 == null && dateClose.isSameOrBefore(t2)))


                }).ToArray();
            }
            else {          //for CEO
                $scope.cntOpen = Enumerable.From($scope.data.TicketsForEmployee).Where(function (i) {
                    var dateOpen = moment(i.TimeOpen, 'DD-MM-YYYY');
                    var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]')) || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) || (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
                }).ToArray();

                $scope.cntClose = Enumerable.From($scope.data.TicketsForEmployee).Where(function (i) {
                    var dateClose = moment(i.TimeClose, 'DD-MM-YYYY');
                    var f2 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t2 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return dateClose != null && ((f2 == null && t2 == null) || (f2 != null && t2 != null && dateClose.isBetween(f2, t2, 'days', '[]')) || (f2 != null && t2 == null && dateClose.isSameOrAfter(f2)) || (t2 != null && f2 == null && dateClose.isSameOrBefore(t2)))


                }).ToArray();
            }
            $scope.countOpen = $scope.cntOpen.length;
            $scope.countClose = $scope.cntClose.length;
            $scope.chartReady = true;
        }


        new Chart(document.getElementById("pie-chart"), {
            type: 'pie',
            data: {
                labels: ["נפתחו", "נסגרו"],
                datasets: [
                  {
                      label: "כמות פניות",
                      backgroundColor: ["#3e95cd", "#8e5ea2"],
                      data: [$scope.countOpen, $scope.countClose]
                  }
                ]
            }
        });
       
        if ($scope.toProduce.category == true) {
            if ($scope.currentUser.Permission != '4') {
                $scope.cntOpen = Enumerable.From($scope.data.TicketsToDo).Where(function (i) {
                    var c = i.CategoryName;
                    return i.Domain == $scope.currentUser.Domain

                }).ToArray();

                $scope.cntClose = Enumerable.From($scope.data.TicketsToDo).Where(function (i) {
                    var dateClose = i.TimeClose == null ? null : moment(i.TimeClose, 'DD-MM-YYYY');
                    var f2 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t2 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return i.Domain == $scope.currentUser.Domain && dateClose != null && ((f2 == null && t2 == null) || (f2 != null && t2 != null && dateClose.isBetween(f2, t2, 'days', '[]')) || (f2 != null && t2 == null && dateClose.isSameOrAfter(f2)) || (t2 != null && f2 == null && dateClose.isSameOrBefore(t2)))

                }).ToArray();
            }
            else {          //for CEO
                $scope.cntOpen = Enumerable.From($scope.data.TicketsToDo).Where(function (i) {
                    var dateOpen = moment(i.TimeOpen, 'DD-MM-YYYY');
                    var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]')) || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) || (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))

                }).ToArray();

                $scope.cntClose = Enumerable.From($scope.data.TicketsToDo).Where(function (i) {
                    var dateClose = moment(i.TimeClose, 'DD-MM-YYYY');
                    var f2 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t2 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return dateClose != null && ((f2 == null && t2 == null) || (f2 != null && t2 != null && dateClose.isBetween(f2, t2, 'days', '[]')) || (f2 != null && t2 == null && dateClose.isSameOrAfter(f2)) || (t2 != null && f2 == null && dateClose.isSameOrBefore(t2)))

                }).ToArray();
            }
            $scope.countOpen = $scope.cntOpen.length;
            $scope.countClose = $scope.cntClose.length;
            $scope.chartReady = true;
        }
      
    }

   

}

