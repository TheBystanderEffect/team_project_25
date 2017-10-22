using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Lifeline
    {

        public Lifeline(Position position)
        {
            this.position = position;
        }

        public Position position { get; set; }
    }
}
