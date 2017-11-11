using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public enum kinds { complete, lost, found, unknow };
    public enum sorts { synchCall, asynchCall, asynchSignal, createMessage, deleteMessage, reply };

    public class Message
    {
        

        public Message(String name, kinds kind, sorts sort, Lifeline start, Lifeline end)
        {
            this.name = name;
            this.kind = kind;
            this.sort = sort;
            this.start = start;
            this.end = end;
        }

        public kinds kind { get; set; }
        public sorts sort { get; set; }
        public String name { get; set; }
        public Lifeline start { get; set; }
        public Lifeline end { get; set; }


        
    }
}
