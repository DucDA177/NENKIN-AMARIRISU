using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;
using static WebApiCore.Commons.Common;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class ListInfoController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        public class DataIn
        {
            public int pageNumber { get; set; }
            public int pageSize { get; set; }
            public List<SearchFilter> searchFilters { get; set; }
            public string EMSCode { get; set; }
            public string TicketWindow { get; set; }
            public float? CostOfLiving { get; set; }
            public float? Calculate { get; set; }
            public bool? Pay { get; set; }
            public DateTime? DateToPay { get; set; }
            public List<ListInfo> ListInfo { get; set; }
        }
        [HttpPost]
        [Route("api/ListInfo/GetAll")]
        public IHttpActionResult GetAll(DataIn dti)
        {
            var data = GetDataAndSorting<ListInfo>(dti.pageNumber, dti.pageSize, db, "ListInfo", dti.searchFilters);

            return Ok(data);
        }
        [HttpGet]
        [Route("api/ListInfo/ValidOnlyPassportNumber")]
        public IHttpActionResult ValidOnlyPassportNumber(string PassportNumber)
        {
            var check = db.ListInfoes.Any(t=> t.PassportNumber == PassportNumber);

            return Ok(check);
        }
        [HttpGet]
        [Route("api/ListInfo/GetListColumn")]
        public IHttpActionResult GetListColumn()
        {
            var listColumn = GetListColumnOfTable("ListInfo", db);

            return Ok(listColumn);
        }
        [HttpPost]
        [Route("api/ListInfo/Save")]
        public IHttpActionResult Save([FromBody] ListInfo ndkt)
        {

            Validate(ndkt);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (ndkt.Id == 0)
            {
                ndkt.Order = "NK" + (db.ListInfoes.Count() + 1).ToString();
                db.ListInfoes.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);

        }
        private void Validate(ListInfo item)
        {
            if (string.IsNullOrEmpty(item.FullName))
            {
                ModelState.AddModelError("FullName", "Họ và tên bắt buộc nhập");
                ModelState.AddModelError("FullName", "has-error");
            }

        }

        [HttpPost]
        [Route("api/ListInfo/UpdateList")]
        public IHttpActionResult UpdateList([FromBody] DataIn dti)
        {
            foreach (var item in dti.ListInfo)
            {
                bool isUpdated = false;

                if (dti.EMSCode != null)
                {
                    item.EMSCode = dti.EMSCode;
                    isUpdated = true;
                }

                if (dti.TicketWindow != null)
                {
                    item.TicketWindow = dti.TicketWindow;
                    isUpdated = true;
                }

                if (dti.CostOfLiving != null)
                {
                    item.CostOfLiving = dti.CostOfLiving;
                    isUpdated = true;
                }

                if (dti.Calculate != null)
                {
                    item.Calculate = dti.Calculate;
                    isUpdated = true;
                }

                if (dti.Pay != null)
                {
                    item.Pay = dti.Pay;
                    isUpdated = true;
                }

                if (dti.DateToPay != null)
                {
                    item.DateToPay = dti.DateToPay;
                    isUpdated = true;
                }

                if (isUpdated)
                    db.Entry(item).State = EntityState.Modified;

            }

            db.SaveChanges();

            return Ok(dti);

        }
        [HttpGet]
        [Route("api/ListInfo/Delete")]
        public IHttpActionResult Delete(int Id)
        {
            var dt = db.ListInfoes.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.ListInfoes.Remove(dt);
            db.SaveChanges();
            return Ok(dt);
        }

        [HttpGet]
        [Route("api/ListInfo/LoadListCTV")]
        public IHttpActionResult LoadListCTV()
        {
            var dt = from usg in db.Group_User
                     join us in db.UserProfiles
                     on usg.UserName equals us.UserName
                     where usg.FInUse == true && usg.CodeGroup == "CTV"
                     && us.FInUse == true
                     select us;

            return Ok(dt);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/ListInfo/SearchByPassportNumber")]
        public IHttpActionResult SearchByPassportNumber(string PassportNumber, string PhoneNumber)
        {
            if (string.IsNullOrEmpty(PassportNumber))
                return BadRequest("Vui lòng nhập số hộ chiếu!");
            if (string.IsNullOrEmpty(PhoneNumber))
                return BadRequest("Vui lòng nhập số điện thoại!");
            var dt = db.ListInfoes.Where(t => t.FInUse == true && t.PassportNumber == PassportNumber).FirstOrDefault();

            if(dt != null)
            {
                var log = db.LogUserSearches
                    .Where(t => t.PassportNumber == PassportNumber && t.PhoneNumber == PhoneNumber)
                    .FirstOrDefault();
                if (log != null)
                {
                    log.Count = log.Count + 1;
                }
                else
                {
                    var newLog = new LogUserSearch();
                    newLog.PassportNumber = PassportNumber;
                    newLog.PhoneNumber = PhoneNumber;
                    newLog.Count = 1;
                    db.LogUserSearches.Add(newLog);
                }

                db.SaveChanges();
            }
            return Ok(dt);
        }

        [HttpGet]
        [Route("api/ListInfo/GetAllSearchAccess")]
        public IHttpActionResult GetAllSearchAccess(int pageNumber, int pageSize, string PhoneNumber)
        {
            var query = db.LogUserSearches.AsQueryable();

            if (!string.IsNullOrEmpty(PhoneNumber))
                query = query.Where(t => t.PhoneNumber == PhoneNumber);

            return Ok(GetPagingList(query, pageNumber, pageSize));
        }
    }
}
