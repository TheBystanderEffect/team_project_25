using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET api/values
        [HttpGet]
        public List<string> Get()
        {
            var client = new MongoClient();
            var db = client.GetDatabase("team");
            var coll = db.GetCollection<BsonDocument>("testing");
            var filter = Builders<BsonDocument>.Filter.Eq("name","dieska");
            var names = coll.Find(filter).ToList();
            
            List<string> wanted = new List<string>();
            foreach (var person in names)
            {
                wanted.Add(person.ToJson());
            }
            return wanted;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            var client = new MongoClient();
            var db = client.GetDatabase("team");
            var coll = db.GetCollection<BsonDocument>("testing");
            string test_js = "{\"name\" : \"unknown\", \"height\" : \"180\" }";

            var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(test_js);
            coll.InsertOneAsync(doc);
           
            return test_js + '\n' + "Successfully added to database";
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

        public ActionResult Insert()
        {
            var client = new MongoClient();
            var db = client.GetDatabase("team");
            var coll = db.GetCollection<BsonDocument>("testing");

            var doc = new BsonDocument {
                {"name","Pista"},
                {"height","170"}
            };
            coll.InsertOneAsync(doc);

           return View();
        }
   
    }

    public class Person
    {
        public ObjectId Id { get; set; }
        public string name { get; set; }
        public string height { get; set; }
    }
}
