using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    public class ListController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/List/GetAll")]
        public IHttpActionResult GetAll(int pageNumber, int pageSize, string searchKey)
        {
            var query = db.Lists.AsQueryable();

            if (!string.IsNullOrEmpty(searchKey))
                query = query.Where(t => t.Name.Contains(searchKey));

            return Ok(Commons.Common.GetPagingList(query,pageNumber,pageSize));
        }

        [HttpPost]
        [Route("api/List/Save")]
        public IHttpActionResult Save([FromBody] List ndkt)
        {

            Validate(ndkt);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (ndkt.Id == 0)
            {
                var latestConfiguration = db.Configurations.OrderByDescending(t => t.Id).FirstOrDefault()?.Id;
                ndkt.IdConfiguration = latestConfiguration;
                db.Lists.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);

        }
        private void Validate(List item)
        {
            if (string.IsNullOrEmpty(item.Name))
            {
                ModelState.AddModelError("Name", "Tên danh sách bắt buộc nhập");
                ModelState.AddModelError("Name", "has-error");
            }
            
        }

        [HttpGet]
        [Route("api/List/Delete")]
        public IHttpActionResult Delete(int Id)
        {
            var dt = db.Lists.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.Lists.Remove(dt);
            db.SaveChanges();
            return Ok(dt);
        }

        [HttpGet]
        [Route("api/List/GetListConfig")]
        public IHttpActionResult GetListConfig(int Id)
        {
            var dt = (from ls in db.Lists
                     join cf in db.Configurations
                     on ls.IdConfiguration equals cf.Id
                     where ls.Id == Id
                     select new
                     {
                         ls,
                         cf
                     }).FirstOrDefault();

            return Ok(dt);
        }
    }
}
