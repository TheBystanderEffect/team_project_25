using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace TP_webApp.Model
{
    public class RefMessage : Message
    {
        [JsonIgnore]
        private Message _message = null;
        [JsonIgnore]
        public Message message { get {
            if (_message == null) {
                _message = this.parentDiagram.layers[layerIndex].messages[messageIndex];
            }
            return _message;
        } set {
            message = value;
        } }

        public int layerIndex { get; set; }
        public int messageIndex { get; set; }
        [JsonIgnore]
        public Diagram parentDiagram { get; set; }

        public RefMessage(Message message): base(null, kinds.unknow, sorts.synchCall, null, null) {
            this.message = message;
        }
        
        [JsonIgnore]
        public new kinds kind { get {
            return message.kind;
        } set {
            message.kind = value;
        } }

        [JsonIgnore]
        public new sorts sort { get {
            return message.sort;
        } set {
            message.sort = value;
        } }

        [JsonIgnore]
        public new String name { get {
            return message.name;
        } set {
            message.name = value;
        } }

        [JsonIgnore]
        public new Lifeline start { get {
            return message.start;
        } set {
            message.start = value;
        } }

        [JsonIgnore]
        public new Lifeline end { get {
            return message.end;
        } set {
            message.end = value;
        } }


        
    }
}
