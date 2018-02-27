using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.IO;
using TP_webApp.Model;
using Newtonsoft.Json.Linq;

namespace TP_webApp.Controllers
{
    [Produces("application/json")]
    [Route("api/Layer")]
    public class LayerController : Controller
    {
        // GET: api/Layer
        [HttpGet]
        public String Get(List<int> route)
        {
            return "abcd";
        }

        // GET: api/Layer/5
        [HttpGet("{id}", Name = "GetLayer")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Layer
        [HttpPost]
        public async Task<string> Post([FromBody]string args)
        {
            JObject obj = JObject.Parse(args);

            List<int> ids = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(obj["pole"].ToString());
            Layer newLayer = obj["objekt"].ToObject<Layer>();

            int diag = ids[0];
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");
            var filter = Builders<BsonDocument>.Filter.Eq("id", diag);
            var data = await coll.Find(filter).SingleAsync();
            var diagram = data.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });

            Diagram d = Newtonsoft.Json.JsonConvert.DeserializeObject<Diagram>(diagram);
            d.layers.Insert(ids[1], newLayer);

            /*for (int x = 1; x < route.Count; x++)
            {
                if (x == 1) act = act.layers[route[x]];
                if(x == route.Count)
                {
                    
                }
                    
            }*/
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(d);
            var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(json);
            await coll.ReplaceOneAsync(filter, doc);
            return json;
        }
        
        // PUT: api/Layer/5
        [HttpPut("{id}")]
        public async Task<string> Put([FromBody]string args)
        {
            JObject obj = JObject.Parse(args);

            List<int> ids = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(obj["pole"].ToString());
            Layer newLayer = obj["objekt"].ToObject<Layer>();

            int diag = ids[0];
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");
            var filter = Builders<BsonDocument>.Filter.Eq("id", diag);
            var data = await coll.Find(filter).SingleAsync();
            var diagram = data.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });

            Diagram d = Newtonsoft.Json.JsonConvert.DeserializeObject<Diagram>(diagram);
            d.layers[ids[1]] = newLayer;

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
