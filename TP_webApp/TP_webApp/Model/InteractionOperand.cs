using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class InteractionOperand
    {
        public String interactionConstraint { get; set; }
        public List<CombinedFragment> combinedFragments { get; set; }
        public List<Message> messages { get; set; }
    }
}
