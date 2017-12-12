using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Diagram
    {
        
        public Diagram(int id, List<Layer> layers)
        {
            this.id = id;
            this.layers = layers;
            
        }

        public List<Layer> layers { get; set; }
       
        public int id { get; set; }

        
    }
}
