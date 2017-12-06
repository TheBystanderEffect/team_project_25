using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using TP_webApp.Model;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.IO;

namespace TP_webApp.Controllers
{
    [Produces("application/json")]
    [Route("api/Lifeline")]
    public class LifelineController : Controller
    {
        // GET: api/Lifeline
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Lifeline/5
        [HttpGet("{id}", Name = "GetLifeline")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/Lifeline
        [HttpPost]
        public async Task<string> Post([FromBody]string args)
        {
            JObject obj = JObject.Parse(args);

            List<int> ids = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(obj["pole"].ToString());
            Lifeline newLifeline = obj["objekt"].ToObject<Lifeline>();

            int diag = ids[0];
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");
            var filter = Builders<BsonDocument>.Filter.Eq("id", diag);
            var data = await coll.Find(filter).SingleAsync();
            var diagram = data.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });

            Diagram d = Newtonsoft.Json.JsonConvert.DeserializeObject<Diagram>(diagram);
            d.layers[ids[1]].lifelines.Insert(ids[2], newLifeline);

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(d);
            var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(json);
            await coll.ReplaceOneAsync(filter, doc);
            return json;
        }
        
        // PUT: api/Lifeline/5
        [HttpPut("{id}")]
        public async Task<string> Put([FromBody]string args)
        {
            JObject obj = JObject.Parse(args);

            List<int> ids = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(obj["pole"].ToString());
            Lifeline newLifeline = obj["objekt"].ToObject<Lifeline>();

            int diagId = ids[0];
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");
            var filter = Builders<BsonDocument>.Filter.Eq("id", diagId);
            var data = await coll.Find(filter).SingleAsync();
            var diagram = data.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });

            Diagram d = Newtonsoft.Json.JsonConvert.DeserializeObject<Diagram>(diagram);
            d.layers[ids[1]].lifelines[ids[2]] = newLifeline;

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(d);
            var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(json);
            await coll.ReplaceOneAsync(filter, doc);
            return json;
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
