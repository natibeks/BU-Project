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
        public static string GetInitData(int uid, bool admin)
        {
            DataSet data = new DataSet();
            var connectStr = WebConfigurationManager.AppSettings["SQLServer"];

            using (conn = new SqlConnection(connectStr))
            {
                SqlCommand sqlComm = new SqlCommand("GetData", conn);
                if (admin)
                    sqlComm.Parameters.AddWithValue("@userId", 0);
                else
                    sqlComm.Parameters.AddWithValue("@userId", uid);
                sqlComm.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = sqlComm;
                da.Fill(data);

                data.Tables[0].TableName = "User";
                data.Tables[1].TableName = "UserDomain";
                data.Tables[2].TableName = "Ticket";
                data.Tables[3].TableName = "UserTicket";
                data.Tables[4].TableName = "Category";
                data.Tables[5].TableName = "Location";
                data.Tables[6].TableName = "TicketsToDo";
                data.Tables[7].TableName = "MyTickets";
                data.Tables[8].TableName = "Task";
                data.Tables[9].TableName = "Status";
                data.Tables[10].TableName = "Role";
                data.Tables[11].TableName = "Domain";
                data.Tables[12].TableName = "Department";

                return JsonConvert.SerializeObject(data);
            }
        }

        public static string SendForgottenPass(string email)
        {
            try
            {
                using (var db = new MSEsystemEntities1())
                {
                    var u = db.User.Where(x => x.EmailAddress == email).FirstOrDefault();
                    if (u == null)
                        return "error";
                    else
                    {
                        string temp = @"{  
                  'Username': '" + email + @"',
                  'mailBody': 'הסיסמא שלך היא: " + u.UserPassword + @"',
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