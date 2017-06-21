using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Web.Configuration;

namespace MoviesLibrary
{
    public class Utils
    {
        private static SqlConnection conn;
        public static string GetInitData(string uid, bool admin)
        {
            DataSet data = new DataSet();
            var connectStr = WebConfigurationManager.AppSettings["SQLServer"];

            using (conn = new SqlConnection(connectStr))
            {
                SqlCommand sqlComm = new SqlCommand("GetData", conn);
                sqlComm.Parameters.AddWithValue("@userId", uid);
                sqlComm.Parameters.AddWithValue("@isAdmin", admin);
                sqlComm.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = sqlComm;
                da.Fill(data);

                data.Tables[0].TableName = "User";
                data.Tables[1].TableName = "Movie";
                data.Tables[2].TableName = "Actor";
                data.Tables[3].TableName = "Director";
                data.Tables[4].TableName = "Genre";
                data.Tables[5].TableName = "MovieActor";

                return JsonConvert.SerializeObject(data);
            }
        }

        public static string Login(dynamic user)
        {
            try
            {
                using (var db = new MoviesDBEntities())
                {
                    string id = Convert.ToString(user.userId);
                    string pass = Convert.ToString(user.password);
                    var b = db.User.Where(i => i.Id == id && i.Password==pass) .FirstOrDefault();

                    return JsonConvert.SerializeObject(b);
                }
            }
            catch (Exception e)
            {
                return JsonConvert.SerializeObject(new { Id = ""});
            }
        }

        public static string SendForgottenPass(string userId)
        {
            try
            {
                using (var db = new MoviesDBEntities() )
                {
                    var u = db.User.Where(x => x.Id == userId).FirstOrDefault();
                    if (u == null)
                        return "error";
                    else
                    {
                        string temp = @"{  
                  'Username': '" + u.Email + @"',
                  'mailBody': 'הסיסמא שלך היא: " + u.Password + @"',
                  'mailTitle': 'שיחזור סיסמא'
                   }
                ";
                        dynamic obj = JObject.Parse(temp);
                        Utils.SendEmail(obj);
                        return "ok";
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public static bool SendEmail(dynamic obj)
        {
            try
            {
                var to = Convert.ToString(obj["Username"]);
                var attach = new List<string>();
                string body = "";
                string title = "";
                title = Convert.ToString(obj["mailTitle"]);
                body = Convert.ToString(obj["mailBody"]);
                var ms = new MailSender();
                ms.Send(to, title, body);
                return true;

            }
            catch (Exception ex)
            {

                return false;
            }
        }
    }
}