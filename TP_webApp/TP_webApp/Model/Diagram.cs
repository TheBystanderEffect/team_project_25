using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Diagram
    {
        
        public Diagram(List<Layer> layers, String metadata)
        {
            this.layers = layers;
            
        }

        public List<Layer> layers { get; set; }
       

        
    }
}
