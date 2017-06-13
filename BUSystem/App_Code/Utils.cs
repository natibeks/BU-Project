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
    

    public static string GetInitData()
    {
        DataSet data = new DataSet();
        var connectStr = WebConfigurationManager.AppSettings["SQLServer"];

        using (conn = new SqlConnection(connectStr))
        {
            SqlCommand sqlComm = new SqlCommand("spGetData", conn);
            sqlComm.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = sqlComm;
            da.Fill(data);

            data.Tables[0].TableName = "User";
            data.Tables[1].TableName = "Employee";
            data.Tables[2].TableName = "Ticket";
            data.Tables[3].TableName = "TicketsForEmployee";
            data.Tables[4].TableName = "Category";
            data.Tables[5].TableName = "Location";
            data.Tables[6].TableName = "TicketsToDo";
            data.Tables[7].TableName = "MyTickets";
            data.Tables[8].TableName = "Task";


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
                b.idCategory = Convert.ToInt32(obj["idCategory"]);
                b.idLocation = Convert.ToInt32(obj["idLocation"]);
                b.Priority = Convert.ToBoolean(obj["Priority"]);
                b.Description = Convert.ToString(obj["Description"]);
                b.Status = "פתוחה";

                db.Ticket.Add(b);
                db.SaveChanges();

                var c = new TicketsForEmployee();
                c.idTicket = b.idTicket;
                c.idUser = Convert.ToString(obj["Owner"]);
                c.TimeOpen = DateTime.Now;
                c.Domain = Convert.ToString(obj["Domain"]);


                db.TicketsForEmployee.Add(c);
                db.SaveChanges();


                return b.idTicket.ToString();
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

                var w = db.Ticket.Where(i => i.idTicket == id).FirstOrDefault();
                w.Status= Convert.ToString(obj["status"]);
                foreach(var t in obj["tasks"])
                {
                    int tid = Convert.ToInt32(t["idTask"]);
                    var k= db.Task.Where(i => i.idTask == tid).FirstOrDefault();

                    k.Done = Convert.ToBoolean(t["Done"]);
                }
                
                db.SaveChanges();

                var z = db.TicketsForEmployee.Where(i => i.idTicket == id).FirstOrDefault();
                z.AnotherAsignee= Convert.ToString(obj["AnotherAsignee"]);
                z.idEmployee= Convert.ToString(obj["idEmployee"]);

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
                b.idTicket = Convert.ToInt32(obj["idTicket"]);
                b.TaskDescription = Convert.ToString(obj["TaskDescription"]);
                b.Done = Convert.ToBoolean(obj["Done"]);
                db.Task.Add(b);
                db.SaveChanges();

                return b.idTask.ToString();
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

                var w = db.Task.Where(i => i.idTask == id).FirstOrDefault();
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
                var w = db.TicketsToDo.Where(i => i.CategoryName == t || i.Description==t).Select(j=>j.idTicket).ToArray();
                
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

    public static string SendForgottenPass(string user)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                var Unfound = false;
                var u = db.User.Where(x => x.uid == user).FirstOrDefault();
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