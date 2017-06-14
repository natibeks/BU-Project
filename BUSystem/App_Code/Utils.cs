using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;

/// <summary>
/// Summary description for Utils
/// </summary>
public class Utils
{
    // public static SqlConnection conn;

    public static SqlConnection conn;
    

    public static string GetInitData(int uid,bool admin)
    {
        DataSet data = new DataSet();
        var connectStr = WebConfigurationManager.AppSettings["SQLServer"];

        using (conn = new SqlConnection(connectStr))
        {
            SqlCommand sqlComm = new SqlCommand("spGetData", conn);
            if(admin)
                sqlComm.Parameters.AddWithValue("@userId", 0);
            else
                sqlComm.Parameters.AddWithValue("@userId", uid);
            sqlComm.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = sqlComm;
            da.Fill(data);

            data.Tables[0].TableName = "User";
            data.Tables[1].TableName = "EmployeeDomains";
            data.Tables[2].TableName = "Ticket";
            data.Tables[3].TableName = "TicketsForEmployee";
            data.Tables[4].TableName = "Category";
            data.Tables[5].TableName = "Location";
            data.Tables[6].TableName = "TicketsToDo";
            data.Tables[7].TableName = "MyTickets";
            data.Tables[8].TableName = "Task";
            data.Tables[9].TableName = "Status";
            data.Tables[10].TableName = "Role";
            data.Tables[11].TableName = "Domain";


            return JsonConvert.SerializeObject(data, new CustomDateTimeConverter());
        }

    }
    public static string AddNewTicket(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {

                var b = new Ticket();
                b.Id = Convert.ToInt32(obj["CategoryID"]);
                b.LocationID = Convert.ToInt32(obj["LocationID"]);
                b.Priority = Convert.ToBoolean(obj["Priority"]);
                b.Description = Convert.ToString(obj["Description"]);
                b.Status = 1;

                db.Ticket.Add(b);
                db.SaveChanges();

                var c = new TicketsForEmployee();
                c.TicketID = b.Id;
                c.UserID = Convert.ToString(obj["UserID"]);
                c.TimeOpen = DateTime.Now;
                c.Domain = Convert.ToString(obj["DomainID"]);


                db.TicketsForEmployee.Add(c);
                db.SaveChanges();


                return b.Id.ToString();
            }
        }
        catch (Exception e)
        {
            return e.Message;
        }
    }

    public static string updateTicket(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {

                int id = Convert.ToInt32(obj["idTicket"]);

                var w = db.Ticket.Where(i => i.Id == id).FirstOrDefault();
                w.Status= Convert.ToString(obj["status"]);
                foreach(var t in obj["tasks"])
                {
                    int tid = Convert.ToInt32(t["idTask"]);
                    var k= db.Task.Where(i => i.Id == tid).FirstOrDefault();

                    k.Done = Convert.ToBoolean(t["Done"]);
                }
                
                db.SaveChanges();

                var z = db.TicketsForEmployee.Where(i => i.TicketID == id).FirstOrDefault();
                z.AnotherAsignee= Convert.ToString(obj["AnotherAsignee"]);
                z.EmploeeID= Convert.ToString(obj["idEmployee"]);

                db.SaveChanges();

                return "OK";
            }
        }
        catch (Exception e)
        {
            return e.Message;
        }
    }


    public static string AddNewTask(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                var b = new Task();
                b.TicketID = Convert.ToInt32(obj["idTicket"]);
                b.TaskDescription = Convert.ToString(obj["TaskDescription"]);
                b.Done = Convert.ToBoolean(obj["Done"]);
                db.Task.Add(b);
                db.SaveChanges();

                return b.Id.ToString();
            }
        }
        catch (Exception e)
        {
            return e.Message;
        }
    }
    public static string DeleteTask(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                int id = Convert.ToInt32(obj["idTask"]);

                var w = db.Task.Where(i => i.Id == id).FirstOrDefault();
                w.isArchive = true;
                db.SaveChanges();
                return "Ok";
            }
        }
        catch (Exception e)
        {
            return "error: " + e.Message;
        }
    }

    public static string[] freeSearch(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                String t = Convert.ToString(obj);
                string[] res = new string[1000];
                int x = 0;
                var w = db.TicketsToDo.Where(i => i.CategoryName == t || i.Description==t).Select(j=>j.TicketID).ToArray();
                
                foreach (dynamic r in w)
                {
                    res.SetValue(r,x);
                    x++;
                }               

                return res;
            }
        }
        catch (Exception e)
        {
            string[] res2 = new string[2];
            res2.SetValue("error: " + e.Message, 0);
            return res2;
        }
    }

    public static string SendForgottenPass(int user)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                var Unfound = false;
                var u = db.User.Where(x => x.Id == user).FirstOrDefault();
                if (u == null)
                    Unfound = true;
                else
                {
                    string temp = @"{  
                  'Username': '" + user + @"',
                  'mailBody': '  הסיסמא שלך היא: " + u.UserPassword + @"',  
                  'mailTitle': 'שיחזור סיסמא'  
                   }";
                    dynamic obj = JObject.Parse(temp);
                    Utils.SendEmail(obj);

                }
                var res = new
                {
                    Status = "Error",
                    Message = "No such user"
                };
                db.SaveChanges();

                return JsonConvert.SerializeObject(res);
            }
        }
        catch (Exception e)
        {
            return e.Message;
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
    class CustomDateTimeConverter : IsoDateTimeConverter
    {
        public CustomDateTimeConverter()
        {
            base.DateTimeFormat = "dd-MM-yyyy hh:mm";
        }
    }
}