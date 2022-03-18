using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Web.UI;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using WebApiCore.Models;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Security.Cryptography;
using System.Text;

namespace WebApiCore.Controllers
{
    
    public class FilesController : ApiController
    {

        private WebApiDataEntities db = new WebApiDataEntities();
        private string folderNCC = HttpContext.Current.Server.MapPath("~/DataNCC/");
        private string folderDinhKem = HttpContext.Current.Server.MapPath("~/FileUploads/");

        [HttpPost]
        [Route("api/Files/UploadFile")]
        public string UploadFile()
        {
            string ListDinhKem = "#";
            try
            {

                string directoryPath = HttpContext.Current.Server.MapPath("~/Uploads");
                string path1 = Request.RequestUri.GetLeftPart(UriPartial.Authority) + "/Uploads"; ;// Request.GetRequestContext().VirtualPathRoot;// Request.Url.GetLeftPart(UriPartial.Authority) + "/Uploads";

                if (!Directory.Exists(directoryPath))
                    Directory.CreateDirectory(directoryPath);

                System.Web.HttpFileCollection httpRequest = System.Web.HttpContext.Current.Request.Files;
                using (var context = new WebApiDataEntities())
                {
                    using (DbContextTransaction transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            for (int i = 0; i <= httpRequest.Count - 1; i++)
                            {
                                string MaDinhKem = "";
                                MaDinhKem = Auto_ID("FILE");
                                var oDK = new FILE_DINH_KEM();
                                System.Web.HttpPostedFile postedfile = httpRequest[i];
                                if (postedfile.ContentLength > 0)
                                {
                                    oDK.FCode = MaDinhKem;
                                    oDK.FName = postedfile.FileName;
                                    string Filesave = MaDinhKem + postedfile.FileName;
                                    if (Filesave.Length > 150)
                                        Filesave = Filesave.Substring(0, 149);
                                    var fileSavePath = Path.Combine(directoryPath, Filesave);
                                    if (File.Exists(fileSavePath))
                                    {
                                        File.Delete(fileSavePath);
                                    }
                                    postedfile.SaveAs(fileSavePath);

                                    oDK.DuongDanFile = Path.Combine(path1, Filesave);// fileSavePath;
                                    if (MaDinhKem != "")
                                    {
                                        context.FILE_DINH_KEM.Add(oDK);
                                        context.SaveChanges();
                                        ListDinhKem = ListDinhKem + MaDinhKem + "#";
                                    }
                                }
                            }
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            Commons.Common.WriteLogToTextFile(ex.ToString());
                        }
                    }
                }
            }
            catch (Exception ex) { Commons.Common.WriteLogToTextFile(ex.ToString()); }
            return ListDinhKem;
        }

        private string Auto_ID(string Code)
        {
            try
            {
                Code = Code.ToUpper();
                AutoID AutoId = db.AutoIDs.Where(x => x.FCode == Code).SingleOrDefault();
                if (AutoId == null)
                {
                    AutoId = new AutoID();
                    AutoId.FCode = Code;
                    AutoId.Counter = 1;
                    db.AutoIDs.Add(AutoId);
                }
                AutoId.FName = Code;
                for (int i = 0; i < 6 - AutoId.Counter.ToString().Length; i++)
                    AutoId.FName += 0;
                AutoId.FName += AutoId.Counter.ToString();
                AutoId.Counter += 1;
                db.SaveChanges();
                return AutoId.FName;
            }
            catch (Exception ex)
            {
                Commons.Common.WriteLogToTextFile(ex.ToString());
                return "";
            }

        }
        [HttpPost]
        [Route("api/Files/FileUpload")]
        public IHttpActionResult Upload()
        {

            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/FILE_DINH_KEM"));

            if (!exists)
                System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/FILE_DINH_KEM"));
            System.Web.HttpFileCollection httpRequest = System.Web.HttpContext.Current.Request.Files;
            for (int i = 0; i <= httpRequest.Count - 1; i++)
            {
                System.Web.HttpPostedFile postedfile = httpRequest[i];
                if (postedfile.ContentLength > 0)
                {
                    var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/FILE_DINH_KEM"), postedfile.FileName);
                    if (File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    postedfile.SaveAs(fileSavePath);
                }
            }
            return Ok();
        }
        public class FileToUpload
        {
            public string FName { get; set; }
            public string key { get; set; }
            public string filename { get; set; }
            public bool isSaved { get; set; }
        }
      
        [HttpGet]
        [Route("api/Files/RemoveTempFolder")]
        public IHttpActionResult RemoveTempFolder(string tempFolder)
        {
            if (!string.IsNullOrEmpty(tempFolder))
            {
                string dir = folderNCC + tempFolder + "/Images";
                if (Directory.Exists(dir))
                {
                    Directory.Delete(dir, true);
                }

            }

            return Ok();
        }
        
        [HttpGet]
        [Route("api/Files/DeleteFile")]
        public IHttpActionResult DeleteFile(string link)
        {
            if (!string.IsNullOrEmpty(link))
            {
                string dir = HttpContext.Current.Server.MapPath("~/" + link);
                if (File.Exists(dir))
                {
                    File.Delete(dir);
                }

            }

            return Ok();
        }
        [HttpGet]
        [Route("api/Files/LockFolder")]
        public IHttpActionResult LockFolder()
        {

            string curUser = HttpContext.Current.User.Identity.Name;
            var curGroup = db.Group_User.Where(t => t.FInUse == true && t.UserName == curUser).FirstOrDefault().CodeGroup;

            if (!curGroup.Contains("ADMIN"))
                return Ok("Bạn không có quyền thao tác này!");

            Commons.Common.LockFolder(folderNCC);

            return Ok("Đã khóa folder " + folderNCC);
        }
        [HttpGet]
        [Route("api/Files/UnLockFolder")]
        public IHttpActionResult UnLockFolder()
        {
            string curUser = HttpContext.Current.User.Identity.Name;
            var curGroup = db.Group_User.Where(t => t.FInUse == true && t.UserName == curUser).FirstOrDefault().CodeGroup;

            if (!curGroup.Contains("ADMIN"))
                return Ok("Bạn không có quyền thao tác này!");

            Commons.Common.UnLockFolder(folderNCC);

            return Ok("Đã mở khóa folder " + folderNCC);
        }

        [HttpGet]
        [Route("api/Files/Cryptographic")]
        public IHttpActionResult Cryptographic(string signature)
        {
            //The hash value to sign.
            //byte[] hashValue = { 59, 4, 248, 102, 77, 97, 142, 201, 210, 12, 224, 93, 25, 41, 100, 197, 213, 134, 130, 135 };
            byte[] hashValue = Encoding.ASCII.GetBytes(signature);
            SHA256 sha256 = new SHA256Managed();
            hashValue = sha256.ComputeHash(hashValue);
            //The value to hold the signed value.
            byte[] signedHashValue;

            //Generate a public/private key pair.
            RSA rsa = RSA.Create();

            //Create an RSAPKCS1SignatureFormatter object and pass it the
            //RSA instance to transfer the private key.
            RSAPKCS1SignatureFormatter rsaFormatter = new RSAPKCS1SignatureFormatter(rsa);

            //Set the hash algorithm to SHA1.
            rsaFormatter.SetHashAlgorithm("SHA256");

            //Create a signature for hashValue and assign it to
            //signedHashValue.
            signedHashValue = rsaFormatter.CreateSignature(hashValue);
            string path = HttpContext.Current.Server.MapPath("~/signature.ca");
            File.WriteAllBytes(path, signedHashValue);

            return Ok(path);
        }
        [HttpGet]
        [Route("api/Files/VerifyCryptographic")]
        public IHttpActionResult VerifyCryptographic(string signature)
        {
            //The hash value to sign.
            //byte[] hashValue = { 59, 4, 248, 102, 77, 97, 142, 201, 210, 12, 224, 93, 25, 41, 100, 197, 213, 134, 130, 135 };
            byte[] hashValue = Encoding.ASCII.GetBytes(signature);
            SHA256 sha256 = new SHA256Managed();
            hashValue = sha256.ComputeHash(hashValue);
            //The value to hold the signed value.
            string path = HttpContext.Current.Server.MapPath("~/signature.ca");

            byte[] signedHashValue;//= sha256.ComputeHash(File.ReadAllBytes(path));
            using (var stream = File.OpenRead(path))
            {
                signedHashValue = sha256.ComputeHash(stream);
            }
            //Generate a public/private key pair.
            RSA rsa = RSA.Create();
            RSAPKCS1SignatureDeformatter rsaDeformatter = new RSAPKCS1SignatureDeformatter(rsa);
            rsaDeformatter.SetHashAlgorithm("SHA256");


            if (rsaDeformatter.VerifySignature(hashValue, signedHashValue))
            {
                return Ok("Correct!");
            }
            else
            {
                return Ok("Incorrect!");
            }

            
        }

       
    }
}