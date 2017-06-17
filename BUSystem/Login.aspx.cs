using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
    }

    protected void Login_Click(object sender, EventArgs e)
    {
        using (var db = new MSEsystemEntities1())
        {

            User user = db.User.Where(i => i.EmailAddress == inputUser.Text && i.UserPassword == inputPassword.Text).FirstOrDefault();
            if (user == null || user.LoginStatus == true)
            {
                pnlMessage.Visible = true;
            }
            else
            {
                Session["user"] = user.DisplayName;
                Session["uid"] = user.Id;
                Session["level"] = user.Role; // 1 - admin , 2 - manager , 3 - employee 

                Response.Redirect("Default.aspx?log=in");
            }
        }
    }

    protected void Reset_Click(object sender, EventArgs e)
    {
        pnlMessage.Visible = false;
        inputUser.Text = "";
        inputPassword.Text = "";
    }



}