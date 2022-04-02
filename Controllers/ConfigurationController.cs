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
    [Authorize]
    public class ConfigurationController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/Configuration/GetAll")]
        public IHttpActionResult GetAll()
        {
            return Ok(db.Configurations.Where(t => t.FInUse).OrderByDescending(t => t.CreatedAt));
        }

        [HttpPost]
        [Route("api/Configuration/Save")]
        public IHttpActionResult Save([FromBody] Configuration ndkt)
        {

            Validate(ndkt);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            if (ndkt.Id == 0)
            {
                db.Configurations.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);

        }
        private void Validate(Configuration item)
        {
            if (item.Figure1 == null)
            {
                ModelState.AddModelError("Figure1", "Thông số 1 bắt buộc nhập");
                ModelState.AddModelError("Figure1", "has-error");
            }
            if (item.Figure2 == null)
            {
                ModelState.AddModelError("Figure2", "Thông số 2 bắt buộc nhập");
                ModelState.AddModelError("Figure2", "has-error");
            }
            if (item.Figure3 == null)
            {
                ModelState.AddModelError("Figure3", "Thông số 3 bắt buộc nhập");
                ModelState.AddModelError("Figure3", "has-error");
            }
            if (item.Figure4 == null)
            {
                ModelState.AddModelError("Figure4", "Thông số 4 bắt buộc nhập");
                ModelState.AddModelError("Figure4", "has-error");
            }
        }

        [HttpGet]
        [Route("api/Configuration/Delete")]
        public IHttpActionResult Delete(int Id)
        {
            var dt = db.Configurations.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.Configurations.Remove(dt);
            db.SaveChanges();
            return Ok(dt);
        }
    }
}
