using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Lifeline
    {
        

        public Lifeline(String name, String type, OccurenceSpecification occuranceSpecification)
        {
            this.name = name;
            this.type = type;
            this.occuranceSpecification = occuranceSpecification;
        }

        public String name { get; set; }
        public String type { get; set; }
        OccurenceSpecification occuranceSpecification { get; set; }
    }
}
