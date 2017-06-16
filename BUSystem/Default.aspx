<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script>
        var scope;

        $(function () {
            scope = angular.element($("body")).scope();
            scope.UserId = "<%=Session["uid"]%>";
            scope.UserLevel = "<%=Session["level"]%>";
            scope.UserName = "<%=Session["user"]%>";

        });
    </script>
</asp:Content>
<asp:Content ID="System" ContentPlaceHolderID="SystemPlaceHolder1" runat="Server">
    <div >
        <nav class="navbar navbar-inverse">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#" data-ng-click="setPage('MyTicket')"><i class="icon ion-ios-gear"></i>&nbsp MSE system</a>
                </div>

                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
                    <ul class="nav navbar-nav">

                        <li><a href="#" data-ng-click="setPage('Reports')" data-ng-show="currentUser.Permission!='1' || currentUser.Permission!='2'">דוחות</a></li>
                        <li><a href="#" data-ng-click="setPage('ManageUsers')" data-ng-if="currentUser.Permission=='0'">ניהול משתמשים</a></li>
                    </ul>

                    <ul class="nav navbar-nav navbar-left">
                        <li><a href="Default.aspx?log=out"><b>יציאה</b></a></li>
                    </ul>

                    <ul class="nav navbar-nav navbar-left">
                        <li style="top: 16px; color: white;">שלום <b><%=Session["user"] %></b>!</li>
                    </ul>
                </div>

            </div>
        </nav>

        <div data-ng-include="'Pages/home.htm'" data-ng-if="loaded"></div>
        <div data-ng-include="'Pages/modals.htm'" data-ng-if="loaded"></div>
    </div>

</asp:Content>
