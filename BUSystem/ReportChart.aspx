<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReportChart.aspx.cs" Inherits="ReportChart" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <script src="scripts/pack/jquery-2.0.0.min.js"></script>
    <script src="http://code.highcharts.com/highcharts.js"></script>
    <title>גרף כלשהו</title>
</head>
<body dir="rtl" style="direction: rtl">
    <form id="form1" runat="server">
        <div id="chartContainer" style="max-width: 500px; margin: auto; height: 400px;">
        </div>
    </form>
</body>
<script>
    $(document).ready(function () {
        //Highcharts.chart('chartContainer', window.myChartData);
        var options = window.myChartData;
        var chart = new Highcharts.Chart(options);
    })
</script>
</html>
