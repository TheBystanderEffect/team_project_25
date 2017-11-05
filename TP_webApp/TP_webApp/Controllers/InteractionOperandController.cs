using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TP_webApp.Controllers
{
    [Produces("application/json")]
    [Route("api/InteractionOperand")]
    public class InteractionOperandController : Controller
    {
        // GET: api/InteractionOperand
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/InteractionOperand/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/InteractionOperand
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }
        
        // PUT: api/InteractionOperand/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
