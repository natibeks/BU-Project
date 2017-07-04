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
using System.Threading;
using System.Threading.Tasks;
using System.Security.Authentication;

namespace MoviesLibrary
{
    public class Utils
    {
        public static async Task<string> GetInitDataAsync(string uid, bool admin)
        {
            var connectStr = WebConfigurationManager.AppSettings["SQLServer"];
            var conn = new SqlConnection(connectStr);

            SqlCommand sqlComm = new SqlCommand("GetData", conn);
            sqlComm.Parameters.AddWithValue("@userId", uid);
            sqlComm.Parameters.AddWithValue("@isAdmin", admin);
            sqlComm.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = sqlComm;
            Task<DataSet> data = new Task<DataSet>(()=>FillDataSet(da));
            data.Start();

            //Async action..
            conn.Close();

            DataSet respose = await data;

            return JsonConvert.SerializeObject(respose);
        }

        private static DataSet FillDataSet(SqlDataAdapter da)
        {
            DataSet data = new DataSet();
            da.Fill(data);

            data.Tables[0].TableName = "User";
            data.Tables[1].TableName = "Movie";
            data.Tables[2].TableName = "Actor";
            data.Tables[3].TableName = "Director";
            data.Tables[4].TableName = "Genre";
            data.Tables[5].TableName = "MovieActor";

            return data;
        }

        public static string Login(dynamic user)
        {
            try
            {
                using (var db = new MoviesDBEntities())
                {
                    string id = Convert.ToString(user.userId);
                    string pass = Convert.ToString(user.password);
                    var b = db.User.Where(i => i.Id == id && i.Password == pass).FirstOrDefault();
                    if (b == null) throw new AuthenticationException("Invalid identification data.");
                    return JsonConvert.SerializeObject(b);
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static string RentMovie(string user, int movie)
        {
            try
            {
                using (var db = new MoviesDBEntities())
                {
                    var m = db.Movie.Where(i => i.Id == movie).FirstOrDefault();
                    var u = db.User.Where(i => i.Id == user).FirstOrDefault();
                    m.WhoRent = user;
                    u.MovieID = movie;
                    db.SaveChanges();
                    return "ok";
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static string ReturnMovie(int movie)
        {
            try
            {
                using (var db = new MoviesDBEntities())
                {
                    var m = db.Movie.Where(i => i.Id == movie).FirstOrDefault();
                    var u = db.User.Where(i => i.Id == m.WhoRent).FirstOrDefault();
                    m.WhoRent = "";
                    u.MovieID = 0;
                    db.SaveChanges();
                    return "ok";
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static string UpdateMovie(dynamic obj)
        {
            try
            {
                using (var db = new MoviesDBEntities())
                {
                    int id = Convert.ToInt32(obj["Id"]);
                    var b = id == 0 ? new Movie() : db.Movie.Where(i => i.Id == id).FirstOrDefault();
                    var isNew = false;
                    if (id == 0)
                        isNew = true;
                    b.Director = Convert.ToInt32(obj["Director"]);
                    b.Genre = Convert.ToInt32(obj["Genre"]);
                    b.Year = Convert.ToInt32(obj["Year"]);
                    b.Plot = Convert.ToString(obj["Plot"]);
                    b.Name = Convert.ToString(obj["Name"]);
                    b.HasPoster = Convert.ToBoolean(obj["HasPoster"]) || Convert.ToBoolean(obj["HasNewPoster"]);

                    var currActors = db.MovieActor.Where(i => i.MovieID == id).ToArray();

                    foreach (var x in obj["Actors"])
                    {
                        int actorid = Convert.ToInt32(x["Id"]);
                        var exist = currActors.Where(z => z.ActorID == actorid).FirstOrDefault();
                        if (exist == null)
                        {
                            var newActor = new MovieActor();
                            newActor.MovieID = id;
                            newActor.ActorID = actorid;
                            db.MovieActor.Add(newActor);
                        }
                        else
                            currActors = currActors.Where(z => z.ActorID != exist.ActorID).ToArray();
                    }

                    foreach (MovieActor x in currActors)
                        db.MovieActor.Remove(x);

                    if (isNew)
                        db.Movie.Add(b);
                    db.SaveChanges();
                    if ((bool)obj["HasNewPoster"] && isNew)
                        ConvertPosterNameToId(Convert.ToString(obj["PosterTS"]), b.Id.ToString());

                    return JsonConvert.SerializeObject(new { Id = b.Id, IsNew = isNew });
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static string ConvertPosterNameToId(string tsFilaname, string id)
        {
            try
            {
                string destPathString = System.Web.Configuration.WebConfigurationManager.AppSettings["UploadedFolder"] + "\\";
                destPathString = System.Web.HttpContext.Current.Server.MapPath(destPathString);
                var dps = string.Format("{0}Temp\\{1}", destPathString, tsFilaname);
                var dps2 = string.Format("{0}{1}{2}", destPathString, id, System.IO.Path.GetExtension(tsFilaname));
                System.IO.File.Move(dps, dps2);

                return "ok";
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string DeleteMovie(int movie)
        {
            try
            {
                using (var db = new MoviesDBEntities())
                {
                    var b = db.Movie.Where(i => i.Id == movie).FirstOrDefault();
                    b.IsArchive = true;
                    var a = db.MovieActor.Where(i => i.MovieID == movie).ToArray();
                    foreach (MovieActor ac in a)
                    {
                        db.MovieActor.Remove(ac);
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

        public static string SendForgottenPass(string userId)
        {
            try
            {
                using (var db = new MoviesDBEntities())
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
            catch (Exception e)
            {

                throw e;
            }
        }
    }
}