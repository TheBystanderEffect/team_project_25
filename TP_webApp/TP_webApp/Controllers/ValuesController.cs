using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.IO;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET api/values
        [HttpGet]
        public List<String> Get()
        {
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("testing");
            var filter = Builders<BsonDocument>.Filter.Eq("name","Bambi");
            var names = coll.Find(filter).ToList();            
            List<String> wanted = new List<String>();
            foreach (var person in names)
            {
                wanted.Add(person.ToJson());
            }
            return wanted;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<String> Get(int id)
        {
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");
            var filter = Builders<BsonDocument>.Filter.Eq("id", id);
            var data = await coll.Find(filter).SingleAsync();
            var diagram = data.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });

            return diagram;
        }

        // POST api/values
        [HttpPost]
        public string Post(string name, string height)
        {

            var client = new MongoClient();
            var db = client.GetDatabase("team");
            var coll = db.GetCollection<BsonDocument>("testing");
            string test_js = "{\"name\" : \"" + name + "\", \"height\" : \""+ height+"\" }";

            var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(test_js);
            coll.InsertOneAsync(doc);

            return test_js + '\n' + "Successfully added to database";
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public string Put()
        {
            return "put";
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        
   
    }

   
}
