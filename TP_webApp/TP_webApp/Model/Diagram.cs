using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Diagram : IDeserializationCallback
    {
        
        public Diagram(int id, List<Layer> layers)
        {
            this.id = id;
            this.layers = layers;
            
        }

        public List<Layer> layers { get; set; }
       
        public int id { get; set; }

        void IDeserializationCallback.OnDeserialization(object sender)
        {
            foreach (Layer i in layers) {
                foreach (Lifeline l in i.lifelines) {
                    foreach (OccurenceSpecification o in l.occurenceSpecifications) {
                        o._message.parentDiagram = this;
                    }
                }
            }
        }
    }
}
