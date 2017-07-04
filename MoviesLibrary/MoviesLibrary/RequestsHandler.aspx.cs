using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;

namespace MoviesLibrary
{
    public partial class RequestsHandler : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (Request["key"] == null) Response.End();
                var tp = Request["key"] as string;
                var postData = new System.IO.StreamReader(Request.InputStream).ReadToEnd();
                dynamic obj = postData == "" ? null : JObject.Parse(postData);
                switch (tp)
                {
                    case "getdata":
                        var id = Convert.ToString(Request["id"]);
                        var admin = Convert.ToBoolean(Request["isadmin"]);
                        Task<string> taskResp = Task.Run(() => Utils.GetInitDataAsync(id, admin));
                        Response.Write(taskResp.Result);
                        break;
                    case "login":
                        Response.Write(Utils.Login(obj));
                        break;
                    case "rentmovie":
                        int movie = Convert.ToInt32(Request["movie"]);
                        string user = Convert.ToString(Request["user"]);
                        Response.Write(Utils.RentMovie(user, movie));
                        break;
                    case "returnmovie":               
                        Response.Write(Utils.ReturnMovie(Convert.ToInt32(Request["movie"])));
                        break;
                    case "updatemovie":
                        Response.Write(Utils.UpdateMovie(obj));
                        break;
                    case "deletemovie":
                        movie = Convert.ToInt32(Request["movieid"]);
                        Response.Write(Utils.DeleteMovie(movie));
                        break;
                    case "ForgotPassword":
                        Response.Write(Utils.SendForgottenPass(Convert.ToString(Request["userId"])));
                        break;
                    default: break;
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                if(ex is AuthenticationException)
                    Response.StatusCode = 501;
                Response.Write(ex.Message);
            }
        }
    }
}