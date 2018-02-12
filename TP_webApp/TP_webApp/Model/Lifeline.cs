using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Lifeline
    {
        

        public Lifeline(String name, String type, List<OccurenceSpecification> occurenceSpecifications)
        {
            this.name = name;
            this.type = type;
            this.occurenceSpecifications = occurenceSpecifications;
        }

        public String name { get; set; }
        public String type { get; set; }
        public List<OccurenceSpecification> occurenceSpecifications { get; set; }
    }
}
