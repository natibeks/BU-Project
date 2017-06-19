using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;


public class MailSender
{
    public string SystemMailAddress = "vzdbtest@gmail.com";
    public string SystemMailFromPassword = "vocalzoom123";
    public string SystemFromName = "VZDB system";

    #region Properties
    public int ObjectID { get; set; }
    public Guid MessageID { get; set; }
    public string FromAddress { get; set; }
    public string FromPassword { get; set; }
    #endregion

    public event Action<Guid, MailMessage> MessageSent;


    #region Methods

    // simple mail to 1 recepient w/o attachments
    public bool Send(string to, string subject, string body)
    {
        MessageID = Guid.NewGuid();

        using (var smtpClient = new SmtpClient()
        {
            Host = "smtp.gmail.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(SystemMailAddress, SystemMailFromPassword)
        })
        {
            using (var mailMsg = new MailMessage())
            {
                mailMsg.From = new MailAddress(SystemMailAddress, SystemFromName);
                mailMsg.Subject = subject;
                mailMsg.Body = body;
                mailMsg.IsBodyHtml = true;
                mailMsg.To.Add(to);
                smtpClient.Credentials = new System.Net.NetworkCredential(SystemMailAddress, SystemMailFromPassword);
                smtpClient.Send(mailMsg);

                if (MessageSent != null)
                    MessageSent.Invoke(MessageID, mailMsg);
            }
        }
        return true;
    }

    // mail to number of recepints with attachments
    public bool Send(List<string> to, string subject, string body, List<string> attachmentPathList)
    {
        MessageID = Guid.NewGuid();

        using (var smtpClient = new SmtpClient()
        {
            Host = "smtp.gmail.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(SystemMailAddress, SystemMailFromPassword)
        })
        {
            using (var mailMsg = new MailMessage())
            {
                mailMsg.From = new MailAddress(SystemMailAddress, SystemFromName);
                mailMsg.Subject = subject;
                mailMsg.Body = body;
                mailMsg.IsBodyHtml = true;

                //  var testMail = Convert.ToString(WebConfigurationManager.AppSettings["TestMail"]);
                foreach (var rec in to)
                {

                    mailMsg.To.Add(rec);

                }

                if (attachmentPathList != null)
                {
                    foreach (var attPath in attachmentPathList)
                    {
                        mailMsg.Attachments.Add(new Attachment(attPath));
                    }
                }

                smtpClient.Credentials = new System.Net.NetworkCredential(SystemMailAddress, SystemMailFromPassword);
                smtpClient.Send(mailMsg);

                if (MessageSent != null)
                    MessageSent.Invoke(MessageID, mailMsg);
            }
        }
        return true;
    }
    #endregion
}
