using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Lifeline
    {
        

        public Lifeline(String name, String type, OccuranceSpecification occuranceSpecification)
        {
            this.name = name;
            this.type = type;
            this.occuranceSpecification = occuranceSpecification;
        }

        public String name { get; set; }
        public String type { get; set; }
        OccuranceSpecification occuranceSpecification { get; set; }
    }
}
