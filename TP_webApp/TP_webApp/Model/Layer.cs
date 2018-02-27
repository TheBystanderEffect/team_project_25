using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Layer
    {

        public Layer(List<Lifeline> lifelines, List<CombinedFragment> combinedFragments, List<Message> messages)
        {
            this.lifelines = lifelines;
            this.combinedFragments = combinedFragments;
            this.messages = messages;            
        }

        public Layer()
        {
        }

        public List<Lifeline> lifelines { get; set; }
        public List<CombinedFragment> combinedFragments { get; set; }
        public List<Message> messages { get; set; }        
    }
}
