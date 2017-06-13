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

            User user = db.User.Where(i => i.uid == inputUser.Text && i.UserPassword == inputPassword.Text).FirstOrDefault();
            if (user == null || user.LoginStatus == true)
            {
                pnlMessage.Visible = true;
            }
            else
            {
                Session["user"] = user.DisplayName;
                Session["uid"] = user.uid;
                Session["level"] = user.Role; // 0 - admin , 1 - regular , 2 - employee , 3 - manager , 4 - cheif 
                
                Response.Redirect("Default.aspx");
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