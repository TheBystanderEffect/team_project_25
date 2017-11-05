using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class CombinedFragment
    {
        public CombinedFragment(String interactionOperator, List<InteractionOperand> interactionOperands)
        {
            this.interactionOperands = interactionOperands;
            this.interactionOperator = interactionOperator;
        }

        public List<InteractionOperand> interactionOperands { get; set; }
        public String interactionOperator { get; set; }
    }
}
