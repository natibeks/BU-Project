<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Login" %>



<asp:Content ID="Login" ContentPlaceHolderID="LoginPlaceHolder" runat="Server">

    <form id="form1" class="form-horizontal" runat="server">
        <div class="panel panel-primary" style="width: 500px; margin: 100px auto 0px;">
            <div class="panel-heading">
                <h2 class="panel-title">מערכת לניהול פניות - מחלקת לוגיסטיקה אורט בראודה</h2>
            </div>
            <div class="panel-body">

                <div class="form-group">
                    <label for="inputUser" class="col-lg-3 control-label">תעודת זהות</label>
                    <div class="col-lg-5">
                        <asp:TextBox runat="server" TextMode="SingleLine" pattern="\d{9}" title="9 ספרות של ת.ז" CssClass="form-control" ID="inputUser" placeholder="תעודת זהות" />
                    </div>
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server"
                        ControlToValidate="inputUser" ForeColor="Red"
                        ErrorMessage="שם משתמש הינו שדה חובה"></asp:RequiredFieldValidator>
                </div>

                <div class="form-group">
                    <label for="inputPassword" class="col-lg-3 control-label">סיסמא</label>
                    <div class="col-lg-5">
                            <asp:TextBox runat="server" TextMode="Password" CssClass="form-control" ID="inputPassword" placeholder="סיסמא" />
                    </div>
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server"
                        ControlToValidate="inputPassword" ForeColor="Red"
                        ErrorMessage="סיסמא האינו שדה חובה"></asp:RequiredFieldValidator>
                </div>

                <div class="form-group">
                    <div class="col-lg-3 col-lg-offset-5">
                    <a href="ResetPassword.aspx" style="color: grey; float: right;">שכחת סיסמא?</a>

                    </div>
                </div>
                <div class="form-group">
                    <div class="col-lg-4 col-lg-offset-7">
                        <asp:Button runat="server" CssClass="btn btn-info" Text="כניסה" OnClick="Login_Click" />
                        <asp:Button runat="server" CausesValidation="False" Text="איתחול" CssClass="btn btn-default" OnClick="Reset_Click" />
                    </div>
                </div>

            </div>

        </div>


        <div style="width: 500px; margin: 10px auto; text-align: center; padding: 8px 0px">
            <asp:Panel runat="server" CssClass="alert alert-danger" ID="pnlMessage" Visible="false">
                זיהוי משתמש נכשל, נסה שנית..
            </asp:Panel>
        </div>
    </form>
</asp:Content>

