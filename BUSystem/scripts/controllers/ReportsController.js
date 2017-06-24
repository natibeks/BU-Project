app.expandReportsController = function ($scope, $http, $timeout, $filter, $window) {

    $scope.toProduce = {
        status: false,
        category: false,
        emp: false,
        build: false,
        dept: false,
        From: "",
        To: "",
        User: 0

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

    $scope.getTitleText = function () {
        return "פניות למחלקה";
    }

    $scope.getSeriesData = function (reportType) {
        switch (reportType) {
            case 1:
                return $scope.getTicketForAllDomainReport();
            case 2:
                return $scope.getTicketForWorkerReport();
            case 3:
                return $scope.getTicketPerPeriodReport();
        }


    }

    $scope.getTicketForAllDomainReport = function () {
        var domainNames = Enumerable.From($scope.data.Domain).Select(function (x) { return { Id: x.Id, Name: x.DomainName }; }).ToArray();
        var domainReportCount = [];
        var domainReport = [];
        angular.forEach(domainNames, function (o, i) {
            domainReportCount[i] = Enumerable.From($scope.data.Ticket).Where(function (x) {
                var dateOpen = moment(x.TimeOpen, 'DD-MM-YYYY HH:mm');
                var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                return $scope.getDomainByCategory(x.CategoryID) == (o.Id) && ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]')) || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) || (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
            }).Count();
            domainReport.push({
                name: o.Name,
                y: domainReportCount[i]
            });
        })
        return domainReport;
    }

    $scope.getTicketPerPeriodReport = function () {
        var filteredTickets = Enumerable.From($scope.data.Ticket).Where(function (x) {
            var dateOpen = moment(x.TimeOpen, 'DD-MM-YYYY HH:mm');
            var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
            var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
            return $scope.currentUser.Domains.indexOf($scope.getDomainByCategory(x.CategoryID)) > -1
                && ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]'))
                || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) ||
                (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
        }).Select(function (x) {
            return { Date: moment(x.TimeOpen, 'DD-MM-YYYY HH:mm').format("MM-YYYY"), Status: x.Status }
        }).
        ToArray();
        console.log(filteredTickets);
        var e = Enumerable.From(filteredTickets).
            GroupBy(
            "$.Date",
                null, // (identity)
                "{ Date: $, Total: $$.Count() }")
        .ToArray();
        e = Enumerable.From(e).Select(function (x) {
            return {
                Date: Date.UTC(moment(x.Date, "MM-YYYY").get('year'),
                    moment(x.Date, "MM-YYYY").get('month')+1,
                    moment(x.Date, "MM-YYYY").get('date')),
                Total: x.Total
            };
        }).ToArray();
        
        return e;
    }

    $scope.getTicketForWorkerReport = function () {
        var ticketsIDs = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.UserID == $scope.toProduce.User; }).Select(function (y) { return y.TicketID;}).ToArray();
        var status = Enumerable.From($scope.data.Status).Select(function (x) { return x.StatusName;}).ToArray();
        var ticketsReport = [];
        var ticketsReportCount = [];
        angular.forEach(status, function (o, i) {
            ticketsReportCount[i] = Enumerable.From($scope.data.Ticket).Where(function (x) {
                if (ticketsIDs.indexOf(x.Id) == -1 && x.Status!=i+1) return false;
                var dateOpen = moment(x.TimeOpen, 'DD-MM-YYYY HH:mm');
                var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                return ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]')) || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) || (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
            }).Count();
            ticketsReport.push({
                name: o,
                y: ticketsReportCount[i]
            });
        })
        return ticketsReport;
    }

    $scope.getReport1 = function () {
        $scope.chartOptions = {
            titleText: $scope.getTitleText(),
            seriesData: $scope.getSeriesData(3)
        }
        console.log($scope.chartOptions.seriesData);
        var options = {
            chart: {
                type: 'bar',
                renderTo: 'chartContainer'
            },
            title: {
                text: 'xAxis datetime example'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of tickets'
                },
                min: 0
            },

            series: [{
                name: 'Winter 2012-2013',
                // Define the data points. All series have a dummy year
                // of 1970/71 in order to be compared on the same x axis. Note
                // that in JavaScript, months start at 0 for January, 1 for February etc.
                data: $scope.chartOptions.seriesData
                }]
            }

        var options1 = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                renderTo: 'chartContainer'
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                layout: 'vertical',
                rtl:true
            },
            xAxis:{
                type: 'datetime'
            },
            title: {
                text: $scope.chartOptions.titleText
            },
            tooltip: {
                pointFormatter: function () {
                    return "כמות: "+this.y ;
                },
                useHTML:true
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.point.name;
                        },
                        useHTML:true,
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                },
            },
            series:
                [{
                    name: 'תחומים',
                    colorByPoint: true,
                    data: $scope.chartOptions.seriesData
                }]
        };
        var newWindow = window.open('ReportChart.aspx', '_blank', 'width=1000,height=700,resizable=1');

        // Access it using its variable
        newWindow.myChartData = options;
    }


    $scope.printReport = function () {

        var printContents = document.getElementById(divToPrint).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();

    }

    $scope.resetReport = function () {
        $scope.toProduce.status = false;
        $scope.toProduce.category = false;
        $scope.toProduce.emp = false;
        $scope.toProduce.build = false;
        $scope.toProduce.dept = false;
        $scope.toProduce.From = "";
        $scope.toProduce.To = "";

        $scope.chartReady = false;
        $scope.countOpen = 0;
        $scope.countClose = 0;
        $scope.countCategory = 0;
    }

    $scope.produceReport = function () {

        if ($scope.toProduce.status == true) {
            if ($scope.currentUser.Permission != 2) {
                $scope.cntOpen = Enumerable.From($scope.data.MyTicket).Where(function (i) {
                    var dateOpen = moment(i.TimeOpen, 'DD-MM-YYYY');
                    var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return i.Domain == $scope.currentUser.Domain && ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]')) || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) || (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))

                }).Count();

                $scope.cntClose = Enumerable.From($scope.data.MyTicket).Where(function (i) {
                    var dateClose = i.TimeClose == null ? null : moment(i.TimeClose, 'DD-MM-YYYY');
                    var f2 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t2 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return i.Domain == $scope.currentUser.Domain && dateClose != null && ((f2 == null && t2 == null) || (f2 != null && t2 != null && dateClose.isBetween(f2, t2, 'days', '[]')) || (f2 != null && t2 == null && dateClose.isSameOrAfter(f2)) || (t2 != null && f2 == null && dateClose.isSameOrBefore(t2)))


                }).Count();
            }
            else {          //for CEO
                $scope.cntOpen = Enumerable.From($scope.data.Ticket).Where(function (i) {
                    var dateOpen = moment(i.TimeOpen, 'DD-MM-YYYY');
                    var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]')) || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) || (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
                }).Count();

                $scope.cntClose = Enumerable.From($scope.data.Ticket).Where(function (i) {
                    var dateClose = moment(i.TimeClose, 'DD-MM-YYYY');
                    var f2 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
                    var t2 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
                    return dateClose != null && ((f2 == null && t2 == null) || (f2 != null && t2 != null && dateClose.isBetween(f2, t2, 'days', '[]')) || (f2 != null && t2 == null && dateClose.isSameOrAfter(f2)) || (t2 != null && f2 == null && dateClose.isSameOrBefore(t2)))


                }).Count();
            }

            $scope.initChartWin({
                ToProduce: $scope.toProduce,
                Data: {
                    CountOpen: $scope.cntOpen, CountClose: $scope.cntClose,
                }
            });
            $scope.chartReady = true;
        }

        $scope.initChartWin = function (data) {
            var popupWindow = window.open('Pages/chart.htm');
            popupWindow.myChartData = data;
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
            if ($scope.currentUser.Permission != 2) {
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

