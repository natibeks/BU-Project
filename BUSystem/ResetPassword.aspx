<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="ResetPassword.aspx.cs" Inherits="ResetPassword" %>

<asp:Content ID="ResetPass" ContentPlaceHolderID="ResetPassPlaceHolder" runat="Server">

    <div class="panel panel-warning"  style="width: 500px; margin: 100px auto 0px;" data-ng-contoller="forgotPassController">
        <div class="panel-heading">
            <h3 class="panel-title">שחזור סיסמא</h3>
        </div>
        <div class="panel-body">
            <form class="form-horizontal" name="passRecoveryForm" data-ng-submit="sendPassToEmail(passRecoveryForm.$valid)">
                <fieldset>
                    <div data-ng-if="!isSucceed">
                        <div class="form-group">
                            <label for="userName" data-ng-model="userName" class="col-lg-3 control-label">שם משתמש</label>
                            <div class="col-lg-5" data-ng-class="{'has-error':passRecoveryForm.username.$error.required}">
                                <input type="text" class="form-control" id="userName" name="username" placeholder="שם משתמש" required data-ng-minlength="1">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-lg-4 col-lg-offset-7">
                                <button type="button" class="btn btn-default" data-ng-click="backToLogin()">חזור</button>
                                <button type="submit" class="btn btn-primary">שלח</button>
                            </div>
                        </div>
                    </div>
                    <div data-ng-if="isSucceed">
                        <h3>בוצע בהצלחה
                        </h3>
                        <div class="col-lg-2 col-lg-offset-6">
                            <a href="Login.aspx" style="color: grey; float: right;">חזור לעמוד התחברות</a>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>

<%--    <div>
        <fieldset style="width: 350px;">
            <legend>Change password example in asp.net</legend>
            <table>
                <tr>
                    <td>User Name: * </td>
                    <td>
                        <asp:TextBox ID="txtUserName" runat="server"></asp:TextBox>
                        <br />
                        <asp:RequiredFieldValidator ID="rfvuserName" runat="server"
                            ErrorMessage="Please enter User Name" ControlToValidate="txtUserName"
                            Display="Dynamic" ForeColor="Red" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </td>
                </tr>
                <tr>
                    <td>Old Password: * </td>
                    <td>
                        <asp:TextBox ID="txtOldPwd" runat="server" TextMode="Password"></asp:TextBox>
                        <br />
                        <asp:RequiredFieldValidator ID="rfvOldPwd" runat="server"
                            ErrorMessage="Please enter old password" ControlToValidate="txtOldPwd"
                            Display="Dynamic" ForeColor="Red" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </td>
                </tr>
                <tr>
                    <td>New Password: * </td>
                    <td>
                        <asp:TextBox ID="txtNewPwd" runat="server" TextMode="Password"></asp:TextBox>
                        <br />
                        <asp:RequiredFieldValidator ID="rfvNewPwd" runat="server"
                            ErrorMessage="Please enter new password" ControlToValidate="txtNewPwd"
                            Display="Dynamic" ForeColor="Red" SetFocusOnError="True"></asp:RequiredFieldValidator>
                    </td>
                </tr>
                <tr>
                    <td>Confirm Password: * </td>
                    <td>
                        <asp:TextBox ID="txtConfirmPwd" runat="server" TextMode="Password"></asp:TextBox>
                        <br />
                        <asp:RequiredFieldValidator ID="rfvConfirmPwd" runat="server"
                            ErrorMessage="Please re-enter password to confirm"
                            ControlToValidate="txtConfirmPwd" Display="Dynamic" ForeColor="Red"
                            SetFocusOnError="True"></asp:RequiredFieldValidator>
                        <asp:CompareValidator ID="cmvConfirmPwd" runat="server"
                            ControlToCompare="txtNewPwd" ControlToValidate="txtConfirmPwd"
                            Display="Dynamic" ErrorMessage="New and confirm password didn't match"
                            ForeColor="Red" SetFocusOnError="True"></asp:CompareValidator>
                    </td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        <asp:Button ID="btnSubmit" runat="server" Text="Change Password"
                            OnClick="btnSubmit_Click" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <asp:Label ID="lblStatus" runat="server" Text=""></asp:Label>
                    </td>
                </tr>
            </table>
        </fieldset>
    </div>--%>
</asp:Content>
