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

    public static string GetInitData(int uid, bool admin)
    {
        DataSet data = new DataSet();
        var connectStr = WebConfigurationManager.AppSettings["SQLServer"];

        using (conn = new SqlConnection(connectStr))
        {
            SqlCommand sqlComm = new SqlCommand("spGetData", conn);
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

            return JsonConvert.SerializeObject(data, new CustomDateTimeConverter());
        }
    }

    public static bool SetUserAsLogged(int uid)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                var b = db.User.Where(i => i.Id == uid).FirstOrDefault();
                b.LoginStatus = true;
                db.SaveChanges();

                return true;
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }

    public static string AddNewTicket(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {

                var b = new Ticket();
                b.Id = Convert.ToInt32(obj["Id"]);
                b.LocationID = Convert.ToInt32(obj["LocationID"]);
                b.Priority = Convert.ToBoolean(obj["Priority"]);
                b.Description = Convert.ToString(obj["Description"]);
                b.CategoryID = Convert.ToInt32(obj["CategoryID"]);
                b.TimeOpen = DateTime.Now;
                DateTime dateValue;
                string s = Convert.ToString(obj["Date"]);
                var formats = new[] { "dd-MM-yyyy", "dd/MM/yyyy", "yyyy-MM-dd HH:mm:ss", "dd-MM-yyyy HH:mm:ss", "dd-MM-yyyy HH:mm" };
                if (DateTime.TryParseExact(s, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out dateValue))
                    b.TimeClose = dateValue;
                else
                    b.TimeClose = DateTime.Now;

                b.Status = 1;

                db.Ticket.Add(b);
                db.SaveChanges();

                var c = new UserTicket();
                c.TicketID = b.Id;
                c.UserID = Convert.ToInt32(obj["UserID"]);
                c.MainUser = true;

                db.UserTicket.Add(c);
                db.SaveChanges();

                return b.Id.ToString();
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    public static string UpdateTicket(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                int id = Convert.ToInt32(obj["Id"]);
                var b = db.Ticket.Where(i => i.Id == id).FirstOrDefault();

                b.Id = id;
                b.LocationID = Convert.ToInt32(obj["LocationID"]);
                b.Priority = Convert.ToBoolean(obj["Priority"]);
                b.Description = Convert.ToString(obj["Description"]);

                DateTime dateValue;
                string s = Convert.ToString(obj["Date"]);
                var formats = new[] { "dd-MM-yyyy", "dd/MM/yyyy", "yyyy-MM-dd HH:mm:ss", "dd-MM-yyyy HH:mm:ss", "dd-MM-yyyy HH:mm" };
                if (DateTime.TryParseExact(s, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out dateValue))
                    b.TimeClose = dateValue;
                else
                    b.TimeClose = DateTime.Now;
                b.Status = Convert.ToInt32(obj["Status"]);

                //foreach (var t in obj["tasks"])
                //{
                //    int tid = Convert.ToInt32(t["TaskID"]);
                //    var k = db.Task.Where(i => i.Id == tid).FirstOrDefault();
                //    k.Done = Convert.ToBoolean(t["Done"]);
                //}

                db.SaveChanges();

                if (Convert.ToInt32(obj["AnotherAsignee"]) > 0)
                {
                    var isNew = false;
                    var z = db.UserTicket.Where(i => i.TicketID == id && i.MainUser == false).FirstOrDefault();
                    if (z == null)
                    {
                        isNew = true;
                        z = new UserTicket();
                    }

                    z.TicketID = id;
                    z.UserID = Convert.ToInt32(obj["AnotherAsignee"]);
                    z.MainUser = false;

                    if (isNew)
                        db.UserTicket.Add(z);
                    db.SaveChanges();
                }


                db.SaveChanges();

                return "ok";
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    public static string DeleteTicket(int id)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                var b = db.Ticket.Where(i => i.Id == id).FirstOrDefault();
                b.IsArchive = true;
                db.SaveChanges();

                return "ok";
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    public static string UpdateTask(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                int id = Convert.ToInt32(obj["Id"]);
                var b = id==0 ? new Task(): db.Task.Where(i => i.Id == id).FirstOrDefault();
                var isNew = false;
                if (id == 0)
                    isNew = true;
                b.TicketID = Convert.ToInt32(obj["TicketID"]);
                b.TaskDescription = Convert.ToString(obj["TaskDescription"]);
                b.Done = Convert.ToBoolean(obj["Done"]);
                if (isNew)
                    db.Task.Add(b);
                db.SaveChanges();

                return b.Id.ToString();
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    public static string DeleteTask(int id)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                var b = db.Task.Where(i => i.Id == id).FirstOrDefault();
                b.IsArchive = true;
                db.SaveChanges();

                return "ok";
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    public static string UpdateUser(dynamic obj)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                int id = Convert.ToInt32(obj["Id"]);
                var b = id == 0 ? new User() : db.User.Where(i => i.Id == id).FirstOrDefault();
                var isNew = false;
                if (Convert.ToInt32(obj["Id"]) == 0)
                    isNew = true;
                b.Role = Convert.ToInt32(obj["Role"]);
                b.DisplayName = Convert.ToString(obj["DisplayName"]);
                b.EmailAddress = Convert.ToString(obj["EmailAddress"]);
                b.TelephoneNumber = Convert.ToString(obj["TelephoneNumber"]);
                b.Department = Convert.ToInt32(obj["Department"]);
                b.UserPassword = Convert.ToString(obj["UserPassword"]);
                var domain = Convert.ToInt32(obj["DomainID"]);
                var doms = db.UserDomain.Where(i => i.UserID == id).ToArray();
                foreach(var dom1 in doms){
                    dom1.IsArchive = true;
                }
                var dom = new UserDomain();
                dom.UserID = id;
                dom.DomainID = domain;
                dom.IsManager = b.Role < 4;
                db.UserDomain.Add(dom);

                if (isNew)
                    db.User.Add(b);
                db.SaveChanges();

                return b.Id.ToString();
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    public static string DeleteUser(int id)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                var b = db.User.Where(i => i.Id == id).FirstOrDefault();
                b.IsArchive = true;
                db.SaveChanges();
                return "ok";
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    public static string CheckTask(int tid)
    {
        try
        {
            using (var db = new MSEsystemEntities1())
            {
                var z = db.Task.Where(i => i.Id == tid).FirstOrDefault();
                z.Done = !z.Done;
                db.SaveChanges();
                return z.Id.ToString();
            }
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    //public static string DeleteTask(dynamic obj)
    //{
    //    try
    //    {
    //        using (var db = new MSEsystemEntities1())
    //        {
    //            int id = Convert.ToInt32(obj["idTask"]);

    //            var w = db.Task.Where(i => i.Id == id).FirstOrDefault();
    //            w.isArchive = true;
    //            db.SaveChanges();
    //            return "Ok";
    //        }
    //    }
    //    catch (Exception e)
    //    {
    //        return "error: " + e.Message;
    //    }
    //}

    //public static string[] freeSearch(dynamic obj)
    //{
    //    try
    //    {
    //        using (var db = new MSEsystemEntities1())
    //        {
    //            String t = Convert.ToString(obj);
    //            string[] res = new string[1000];
    //            int x = 0;
    //            var w = db.TicketsToDo.Where(i => i.CategoryName == t || i.Description==t).Select(j=>j.TicketID).ToArray();

    //            foreach (dynamic r in w)
    //            {
    //                res.SetValue(r,x);
    //                x++;
    //            }               

    //            return res;
    //        }
    //    }
    //    catch (Exception e)
    //    {
    //        string[] res2 = new string[2];
    //        res2.SetValue("error: " + e.Message, 0);
    //        return res2;
    //    }
    //}
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
class CustomDateTimeConverter : IsoDateTimeConverter
{
    public CustomDateTimeConverter()
    {
        base.DateTimeFormat = "dd-MM-yyyy hh:mm";
    }
}
}