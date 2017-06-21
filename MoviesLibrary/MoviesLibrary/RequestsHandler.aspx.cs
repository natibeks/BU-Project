﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json.Linq;

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
                        Response.Write(Utils.GetInitData(id, admin));
                        break;
                    case "login":
                        Response.Write(Utils.Login(obj));
                        break;
                    //case "addNewTicket":
                    //    Response.Write(Utils.AddNewTicket(obj));
                    //    break;
                    //case "addTask":
                    //    Response.Write(Utils.UpdateTask(obj));
                    //    break;
                    //case "checkTask":
                    //    Response.Write(Utils.CheckTask(Convert.ToInt32(Request["TaskID"])));
                    //    break;
                    //case "delTask":
                    //    Response.Write(Utils.DeleteTask(Convert.ToInt32(Request["task"])));
                    //    break;
                    //case "freeSearch":
                    //    Response.Write(Utils.freeSearch(obj));
                    //    break;
                    case "ForgotPassword":
                        Response.Write(Utils.SendForgottenPass(Convert.ToString(Request["userId"])));
                        break;
                    //case "updateTicket":
                    //    Response.Write(Utils.UpdateTicket(obj));
                    //    break;
                    //case "delTicket":
                    //    Response.Write(Utils.UpdateTicket(Convert.ToString(Request["ticket"])));
                    //    break;
                    //case "updUser":
                    //    Response.Write(Utils.UpdateUser(obj));
                    //    break;
                    //case "delUser":
                    //    Response.Write(Utils.DeleteUser(Convert.ToInt32(Request["user"])));
                    //    break;

                    default: break;
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                Response.Write(ex.Message);
            }
        }
    }
}