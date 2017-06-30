app.expandReportsController = function ($scope, $http, $timeout, $filter, $window) {

    $scope.toProduce = {
        status: false,
        category: false,
        emp: false,
        build: false,
        dept: false,
        From: "",
        To: "",
        User: 0,
        Type: 1

    }

    $scope.reportsList = [
        {Id: 1, Name: 'דו"ח מנכ"ל - מספר פניות לכל תחומי ניהול'},
        {Id: 2, Name: 'דו"ח מנהל - מספר פניות חודשי לתחום ניהולו'},
        {Id: 3, Name: 'דו"ח מנהל - מספר פניות חודשי לעובד'},
        {Id: 4, Name: 'דו"ח מנהל - מספר פניות חודשי במבנה'},
        {Id: 5, Name: 'דו"ח מנהל - מספר פניות חודשי בקטגוריה'},
    ]

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
        switch ($scope.toProduce.Type) {
            case 1:
                return "מספר פניות לכל תחומי ניהול";
            case 3:
                return "מספר פניות לחודש לעובד " + $scope.getUserDisplayName($scope.toProduce.User);
            case 2:
                return "מספר פניות חודשי לתחום ניהולו";
            case 4:
                return "מספר פניות חודשי במבנה " + $scope.toProduce.Building;
            case 5:
                return "מספר פניות חודשי בקטגוריה " + $scope.getCategory($scope.toProduce.Category);
        }
    }

    $scope.getSeriesData = function () {
        switch ($scope.toProduce.Type) {
            case 1:
                return $scope.getTicketForAllDomainReport();
            case 2:
                return $scope.getTicketPerPeriodReport();
            case 3:
                return $scope.getTicketForWorkerReport();
            case 4:
                return $scope.getTicketPerPeriodInBuildingReport();
            case 5:
                return $scope.getTicketPerPeriodInCategoryReport();
        }
    }

    $scope.getSeriesName = function () {
        switch ($scope.toProduce.Type) {
            case 1:
                return "פניות למחלקה";
            case 3:
                return "פניות לעובד";
            case 2:
                return "פניות";
            case 4:
                return "פניות במבנה";
            case 5:
                return "פניות בקטגוריה";
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
            var flag1 = $scope.currentUser.Domains.indexOf($scope.getDomainByCategory(x.CategoryID)) > -1;
            var flag2 = $scope.isUserManagerOfThisCategory(x.CategoryID);
            return flag1 && flag2 &&
                ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]'))
                || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) ||
                (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
        }).Select(function (x) {
            return { Date: moment(x.TimeOpen, 'DD-MM-YYYY HH:mm').format("MM-YYYY"), Status: x.Status }
        }).
        ToArray();
        var e = Enumerable.From(filteredTickets).
            GroupBy(
            "$.Date",
                null,
                "{ Date: $, Total: $$.Count() }")
        .ToArray();
        e = Enumerable.From(e).Select(function (x) {
            return [
                (Date.UTC(moment(x.Date, "MM-YYYY").get('year'),
                    moment(x.Date, "MM-YYYY").get('month'),
                    01)),
                x.Total];
        }).ToArray();
        
        return e;
    }

    $scope.getTicketPerPeriodInStatusReport = function () {
        var filteredTickets = Enumerable.From($scope.data.Ticket).Where(function (x) {
            var dateOpen = moment(x.TimeOpen, 'DD-MM-YYYY HH:mm');
            var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
            var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
            return x.Status==$scope.toProduce.Status &&
            $scope.currentUser.Domains.indexOf($scope.getDomainByCategory(x.CategoryID)) > -1 && $scope.isUserManagerOfThisCategory(x.CategoryID)
                && ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]'))
                || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) ||
                (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
        }).Select(function (x) {
            return { Date: moment(x.TimeOpen, 'DD-MM-YYYY HH:mm').format("MM-YYYY"), Status: x.Status }
        }).
        ToArray();
        var e = Enumerable.From(filteredTickets).
            GroupBy(
            "$.Date",
                null,
                "{ Date: $, Total: $$.Count() }")
        .ToArray();
        e = Enumerable.From(e).Select(function (x) {
            return [
                (Date.UTC(moment(x.Date, "MM-YYYY").get('year'),
                    moment(x.Date, "MM-YYYY").get('month') + 1,
                    01)),
                x.Total];
        }).ToArray();

        return e;
    }

    $scope.getTicketPerPeriodInBuildingReport = function () {
        var filteredTickets = Enumerable.From($scope.data.Ticket).Where(function (x) {
            var dateOpen = moment(x.TimeOpen, 'DD-MM-YYYY HH:mm');
            var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
            var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
            var flag1 = $scope.isInBuilding($scope.toProduce.Building, x.LocationID);
            var flag2 = $scope.currentUser.Domains.indexOf($scope.getDomainByCategory(x.CategoryID)) > -1;
            var flag3 = $scope.isUserManagerOfThisCategory(x.CategoryID);
            return flag1 && flag2 && flag3
                && ( (f1 == null && t1 == null)
                || ( f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]') )
                || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1))
                || ( t1 != null && f1 == null && dateOpen.isSameOrBefore(t1) ) )
        }).Select(function (x) {
            return { Date: moment(x.TimeOpen, 'DD-MM-YYYY HH:mm').format("MM-YYYY"), Status: x.Status }
        }).
        ToArray();
        var e = Enumerable.From(filteredTickets).
            GroupBy(
            "$.Date",
                null,
                "{ Date: $, Total: $$.Count() }")
        .ToArray();
        e = Enumerable.From(e).Select(function (x) {
            return [
                (Date.UTC(moment(x.Date, "MM-YYYY").get('year'),
                    moment(x.Date, "MM-YYYY").get('month'),
                    01)),
                x.Total];
        }).ToArray();

        return e;
    }

    $scope.getTicketPerPeriodInCategoryReport = function () {
        var filteredTickets = Enumerable.From($scope.data.Ticket).Where(function (x) {
            var dateOpen = moment(x.TimeOpen, 'DD-MM-YYYY HH:mm');
            var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
            var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
            return $scope.toProduce.Category == x.CategoryID &&
            $scope.currentUser.Domains.indexOf($scope.getDomainByCategory(x.CategoryID)) > -1 && $scope.isUserManagerOfThisCategory(x.CategoryID)
                && ((f1 == null && t1 == null) || (f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]'))
                || (f1 != null && t1 == null && dateOpen.isSameOrAfter(f1)) ||
                (t1 != null && f1 == null && dateOpen.isSameOrBefore(t1)))
        }).Select(function (x) {
            return { Date: moment(x.TimeOpen, 'DD-MM-YYYY HH:mm').format("MM-YYYY"), Status: x.Status }
        }).
        ToArray();
        var e = Enumerable.From(filteredTickets).
            GroupBy(
            "$.Date",
                null,
                "{ Date: $, Total: $$.Count() }")
        .ToArray();
        e = Enumerable.From(e).Select(function (x) {
            return [
                (Date.UTC(moment(x.Date, "MM-YYYY").get('year'),
                    moment(x.Date, "MM-YYYY").get('month') + 1,
                    01)),
                x.Total];
        }).ToArray();

        return e;
    }
  
    $scope.getTicketForWorkerReport = function () {
        var ticketsIDs = Enumerable.From($scope.data.UserTicket).Where(function (x) { return x.UserID == $scope.toProduce.User; }).Select(function (y) { return y.TicketID;}).ToArray();
        var status = Enumerable.From($scope.data.Status).Select(function (x) { return x.StatusName;}).ToArray();

        var filteredTickets = Enumerable.From($scope.data.Ticket).Where(function (x) {
            if (ticketsIDs.indexOf(x.Id) == -1) return false;
            var dateOpen = moment(x.TimeOpen, 'DD-MM-YYYY HH:mm');
            var f1 = $scope.toProduce.From == "" ? null : moment($scope.toProduce.From, 'DD-MM-YYYY');
            var t1 = $scope.toProduce.To == "" ? null : moment($scope.toProduce.To, 'DD-MM-YYYY');
            var flag1 = $scope.currentUser.Domains.indexOf($scope.getDomainByCategory(x.CategoryID)) > -1;
            var flag2 = $scope.isUserManagerOfThisCategory(x.CategoryID);
            return flag1 && flag2
                && ( (f1 == null && t1 == null) ||
                ( f1 != null && t1 != null && dateOpen.isBetween(f1, t1, 'days', '[]') ) ||
                ( f1 != null && t1 == null && dateOpen.isSameOrAfter(f1) ) ||
                ( t1 != null && f1 == null && dateOpen.isSameOrBefore(t1) ) )
        }).Select(function (x) {
            return { Date: moment(x.TimeOpen, 'DD-MM-YYYY HH:mm').format("MM-YYYY"), Status: x.Status }
        }).
        ToArray();
        var e = Enumerable.From(filteredTickets).
            GroupBy(
            "$.Date",
                null,
                "{ Date: $, Total: $$.Count() }")
        .ToArray();
        e = Enumerable.From(e).Select(function (x) {
            return [
                (Date.UTC(moment(x.Date, "MM-YYYY").get('year'),
                    moment(x.Date, "MM-YYYY").get('month') + 1,
                    01)),
                x.Total];
        }).ToArray();

        return e;
    }

    $scope.generateReport = function () {
        $scope.chartOptions = {
            titleText: $scope.getTitleText(),
            seriesData: $scope.getSeriesData(),
            seriesName: $scope.getSeriesName()
        }
        console.log($scope.chartOptions.seriesData);
        if ($scope.toProduce.Type == 1) {
            var options = {
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
                    rtl: true
                },
                xAxis: {
                    type: 'datetime'
                },
                title: {
                    text: $scope.chartOptions.titleText
                },
                tooltip: {
                    pointFormatter: function () {
                        return "כמות: " + this.y;
                    },
                    useHTML: true
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
                            useHTML: true,
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

        }
        else
        {
            var options = {
                chart: {
                    chart: 'spline',
                    renderTo: 'chartContainer'
                },
                eporting:{
                    enabled:true,
                },
                rangeSelector:{
                    selected: 1
                },
                legend: {
                    align: 'center',
                    layout: 'vertical',
                    rtl: true,
                    useHTML: true
                },
                title: {
                    text: $scope.chartOptions.titleText
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%y / %m',
                        week: '%y / %m',
                        month: '%y / %m',
                        year: '%y / %m'
                    },
                    rtl: true,
                    useHTML: true
                },
                yAxis: {
                    title: {
                        text: 'פניות'
                    },
                    allowDecimals: false
                },
                tooltip: {
                    useHTML: true,
                    formatter: function () {
                        return " כמות הפניות ב <b>" + moment(this.x).format("MM/YYYY") + "</b><br/> היא <b>" + this.y + "</b>"
                    }
                },

                series: [{
                    name: $scope.chartOptions.seriesName,
                    data: $scope.chartOptions.seriesData
                }]
            }
        }

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

}

