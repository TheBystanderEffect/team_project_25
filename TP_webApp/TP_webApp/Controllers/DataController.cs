using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.IO;
using TP_webApp.Model;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    public class DataController : Controller
    {
        public MongoClient client = new MongoClient();

        [HttpGet]
        [ActionName("nextId")]
        public int GetNextId()
        {
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("usedIds");
            return coll.FindOneAndUpdate(new BsonDocument(), new UpdateDefinitionBuilder<BsonDocument>().Inc<int>("id",1)).ToBsonDocument().GetValue("id").ToInt32();
        }
           

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
                new Lifeline("","",new OccurenceSpecification()), new Lifeline("", "", new OccurenceSpecification()));

            var jsonik= Newtonsoft.Json.JsonConvert.SerializeObject(message);

            return jsonik;
        }
        /*****************************ZISKANIE A ULOZENIE DIAGRAMU****************************************/

        // GET api/data/diagram/
        [HttpGet("")]
        [ActionName("diagram")]
        public async Task<String> GetAll([FromQuery]string[] select)
        {
            //var client = new MongoClient();
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
            //var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");
            var filter = Builders<BsonDocument>.Filter.Eq("_diagramId", id);
            var data = await coll.Find(filter).SingleAsync();
            var diagram = data.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });

            return diagram;
        }


        // POST api/data/diagram
        [HttpPost]
        [ActionName("diagram")]
        public void Post([FromBody]JObject test_json)
        {
           // var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");

            try{
                var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(test_json.ToString());
                coll.InsertOneAsync(doc);
            } catch (Exception e) {
                Console.WriteLine("An exception was thrown: " + e);
            }
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        [ActionName("diagram")]
        public void Post([FromBody]JObject test_json, int id)
        {
          //  var client = new MongoClient();
            var db = client.GetDatabase("tp");
            var coll = db.GetCollection<BsonDocument>("diagrams");

            try{
                var doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(test_json.ToString());
                coll.ReplaceOneAsync(new BsonDocument {{"_diagramId", id}}, doc);
                Console.WriteLine("Replace with id: " + id);
            } catch (Exception e) {
                Console.WriteLine("An exception was thrown: " + e);
            }
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        
   
    }

   
}
