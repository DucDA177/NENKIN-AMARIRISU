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
    public class ListInfoController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        public class DataIn
        {
            public int pageNumber { get; set; }
            public int pageSize { get; set; }
            public List<SearchFilter> searchFilters { get; set; }
        }
        [HttpPost]
        [Route("api/ListInfo/GetAll")]
        public IHttpActionResult GetAll(DataIn dti)
        {
            var data = GetDataAndSorting<ListInfo>(dti.pageNumber, dti.pageSize, db, "ListInfo", dti.searchFilters);

            return Ok(data);
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
        [Route("api/ListInfo/SearchByPassportNumber")]
        public IHttpActionResult SearchByPassportNumber(string PassportNumber)
        {
            if (string.IsNullOrEmpty(PassportNumber))
                return BadRequest("Vui lòng nhập số hộ chiếu!");
            var dt = db.ListInfoes.Where(t => t.FInUse == true && t.PassportNumber == PassportNumber).FirstOrDefault();
            return Ok(dt);
        }
    }
}
