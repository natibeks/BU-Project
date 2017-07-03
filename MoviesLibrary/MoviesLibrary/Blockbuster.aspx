<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Blockbuster.aspx.cs" Inherits="MoviesLibrary.Blockbuster1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Blockbuster - Movies Rental System</title>
    <link rel="shortcut icon" type="image/x-icon" href="bbicon.ico" />

    <link href="https://cdnjs.cloudflare.com/ajax/libs/angular-moment-picker/0.10.1/angular-moment-picker.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" />
    <link href="styles/packs/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.min.css" rel="stylesheet" />
    <link href="styles/bbstyle.css" rel="stylesheet" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/linq.js/2.2.0.2/linq.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-sanitize.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/danialfarid-angular-file-upload/12.2.13/ng-file-upload.min.js"></script>   
    <script src="scripts/packs/angular-route.js"></script>
    <script src="scripts/packs/bootstrap.min.js"></script>

    <script src="scripts/app.js"></script>
    <script src="scripts/services.js"></script>
    <script src="scripts/directives.js"></script>
    <script src="scripts/config.js"></script>
    <script src="scripts/filters.js"></script>
    <script src="scripts/controllers/login.controller.js"></script>
    <script src="scripts/controllers/home.controller.js"></script>
    <script src="scripts/controllers/main.controller.js"></script>
    <script src="scripts/controllers/table.controller.js"></script>
</head>
<body data-ng-app="myApp" data-ng-controller="MainController">
    <header>
        <!--Top navigation bar snippet-->
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2" data-ng-if="loginStatus">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#Home" data-ng-click="setPage(1,true)">BLOCKBUSTER</a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" data-ng-if="loginStatus">
                    <ul class="nav navbar-nav">
                        <li data-ng-class="{'active':$scope.currentPage==1}"><a href="#Home" data-ng-click="setPage(1,true)">Main<span class="sr-only">(current)</span></a></li>
                        <li data-ng-class="{'active':$scope.currentPage==2}"><a href="#Movies" prevent-default data-ng-click="setPage(2)">Movies</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <div data-ng-include="'inc/modals.html'"></div>

    <div data-ng-view data-ng-show="!loadingStatus" class="container"></div>

    <!--Rounded loader animation-->
    <div class="loader" data-ng-show="loadingStatus"></div>

    <footer>
        Created By Netanel Avaksis &copy; 2017
    </footer>
</body>
</html>
