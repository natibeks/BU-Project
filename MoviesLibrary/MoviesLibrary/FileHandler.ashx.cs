using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesLibrary
{
    /// <summary>
    /// Service to handler posters uploading .
    /// </summary>
    public class FileHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string fileId = context.Request["id"];
            if (fileId == "0")
                fileId = GetCurrentUnixTimestamp().ToString();

            if (context.Request.Files.Count > 0)
            {
                try
                {
                    HttpFileCollection files = context.Request.Files;
                    HttpPostedFile file = files[0];
                    string folderPath = System.Web.Configuration.WebConfigurationManager.AppSettings["UploadFolder"] + "\\";
                    string filePath = folderPath + fileId + "." + System.IO.Path.GetExtension(file.FileName);
                    if (System.IO.File.Exists(filePath)){
                        System.IO.File.Delete(filePath);
                    }
                    file.SaveAs(filePath);
                    context.Response.Write(System.IO.Path.GetFileName(filePath));
                }
                catch (Exception ex)
                {
                    context.Response.StatusCode = 500;
                    context.Response.Write(ex.Message);
                }
            }
        }

        public long GetCurrentUnixTimestamp()
        {
            Int32 unixTimestamp = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            return unixTimestamp;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}