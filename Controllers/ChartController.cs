using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class ChartController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpGet]
        [Route("api/Chart/GeneralInfo")]
        public IHttpActionResult GeneralInfo()
        {
            return Ok(new
            {
                countListInfo = db.ListInfoes.Count(),
                countListInfoPaid = db.ListInfoes.Where(t => t.Pay == true).Count(),
                countSearchAccess = db.LogUserSearches.Sum(t => t.Count),
                countListInfoSearched = db.LogUserSearches.Select(t => t.PassportNumber).Distinct().Count()
            });
        }

        public class DataOut
        {
            public string name { get; set; }
            public int value { get; set; }
            public string fullname { get; set; }
        }
        [HttpGet]
        [Route("api/Chart/ListInfoError")]
        public IHttpActionResult ListInfoError()
        {
            List<DataOut> ls = new List<DataOut>();

            DataOut dt1 = new DataOut();
            dt1.name = "Hồ sơ lỗi";
            dt1.value = db.ListInfoes.Where(t => !string.IsNullOrEmpty(t.Error)).Count();
            ls.Add(dt1);


            DataOut dt3 = new DataOut();
            dt3.name = "Hồ sơ không lỗi";
            dt3.value = db.ListInfoes.Where(t => string.IsNullOrEmpty(t.Error)).Count();
            ls.Add(dt3);

            return Ok(ls);

        }

        [HttpGet]
        [Route("api/Chart/ListInfoPaid")]
        public IHttpActionResult ListInfoPaid()
        {
            List<DataOut> ls = new List<DataOut>();

            DataOut dt1 = new DataOut();
            dt1.name = "Hồ sơ đã thanh toán";
            dt1.value = db.ListInfoes.Where(t => t.Pay == true).Count();
            ls.Add(dt1);


            DataOut dt3 = new DataOut();
            dt3.name = "Hồ sơ chưa thanh toán";
            dt3.value = db.ListInfoes.Where(t => t.Pay != true).Count();
            ls.Add(dt3);

            return Ok(ls);

        }

        [HttpGet]
        [Route("api/Chart/ListInfoType")]
        public IHttpActionResult ListInfoType()
        {
            List<DataOut> ls = new List<DataOut>();

            DataOut dt1 = new DataOut();
            dt1.name = "Hồ sơ chỉ có thông tin chung";
            dt1.value = db.ListInfoes.Where(t => t.Pay != true && (t.Pension_Tax == null || t.Pension_Tax == 0)).Count();
            ls.Add(dt1);

            DataOut dt2 = new DataOut();
            dt2.name = "Hồ sơ đã tính toán thông số";
            dt2.value = db.ListInfoes.Where(t => t.Pension_Tax != null && t.Pension_Tax != 0).Count();
            ls.Add(dt2);

            DataOut dt3 = new DataOut();
            dt3.name = "Hồ sơ đã được thanh toán";
            dt3.value = db.ListInfoes.Where(t => t.Pay == true ).Count();
            ls.Add(dt3);


           

            return Ok(ls);

        }
    }
}
