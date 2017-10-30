using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.IO;
using TP_webApp.Model;


namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    public class DataController : Controller
    {
     /*   // GET api/values
        [HttpGet]
        [ActionName("diagram")]
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
        }*/

        

        [HttpPost]
        [ActionName("message")]
        public void SaveMessage([FromBody]String message)
        {
            var newMessage = Newtonsoft.Json.JsonConvert.DeserializeObject<Message>(message);
            Console.WriteLine(newMessage.name);
        }

        [HttpGet] 
        [ActionName("message")]
        public String SendMessage()
        {
            
            Message message = new Message("sprava", kinds.complete, sorts.createMessage, 
                new Lifeline(new Position(12,13.5,22.1,0,0)), new Lifeline(new Position(12, 18.55, 22.1,0,0)));

            var jsonik= Newtonsoft.Json.JsonConvert.SerializeObject(message);

            return jsonik;
        }
        /*****************************ZISKANIE A ULOZENIE DIAGRAMU****************************************/

        // GET api/data/diagram/
        [HttpGet("")]
        [ActionName("diagram")]
        public async Task<String> GetAll([FromQuery]string[] select)
        {
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");
            Dictionary<string, int> dict = new Dictionary<string, int>();
            foreach(string i in select) {
                dict.Add(i,1);
            }
            var filter = new BsonDocument(dict);
            var data = await coll.Find(new BsonDocument()).Project(filter).ToListAsync();
            var diagram = data.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });

            return diagram;
        }

        // GET api/data/diagram/5
        [HttpGet("{id}")]
        [ActionName("diagram")]
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


        // POST api/data/diagram
        [HttpPost]
        [ActionName("diagram")]
        public void Post([FromBody]String test_json)
        {
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");

            var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(test_json);
            coll.InsertOneAsync(doc);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        [ActionName("diagram")]
        public void Post([FromBody]String test_json, int id)
        {
            var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");

            var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(test_json);
            coll.ReplaceOneAsync(new BsonDocument{{ "id", id }}, doc);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        
   
    }

   
}
