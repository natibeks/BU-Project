<%@ WebHandler Language="C#" Class="imgUploader" %>

using System;
using System.Web;
using System.IO;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

public class imgUploader : IHttpHandler {
    
    public void ProcessRequest (HttpContext myContext) {
        myContext.Response.ContentType = "text/plain";
        try
        {
            var id = HttpContext.Current.Request["movieId"];
            string imgFullFileName = "";

            HttpPostedFile img = myContext.Request.Files[0];
            string imgName = img.FileName;
            var imgExtension = Path.GetExtension(imgName).ToLower();

            if (imgExtension == ".gif" || imgExtension == ".jpg" || imgExtension == ".png" || imgExtension == ".bmp")
            {
                if (!string.IsNullOrEmpty(imgName))
                {
                    imgFullFileName = id.ToString() + "." + imgExtension;
                    string pathToSave = HttpContext.Current.Server.MapPath("~/posters/") + imgFullFileName;

                    var ih = new ImageHandler();
                    var bmpPostedImage = new System.Drawing.Bitmap(img.InputStream);
                    ih.Save(bmpPostedImage, 90, 135, 100, pathToSave);

                }
                myContext.Response.Write(imgFullFileName);
            }
            else
            {
                myContext.Response.Write("Image format error");
            }
        }
        catch (Exception ac)
        {
            myContext.Response.Write("Image uploading finished unsuccessfuly.");
        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}