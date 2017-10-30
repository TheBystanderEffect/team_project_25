using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TP_webApp.Model
{
    public class Position
    {
       /* public Position(Double x, Double y, Double z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public Position(Double x, Double y, Double z, Double length)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.length = length;
        }*/

        public Position(Double x, Double y, Double z, Double width, Double heigh)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.width = width;
            this.heigh = heigh;
        }

        public Double x { get; set; }
        public Double y { get; set; }
        public Double z { get; set; }
        public Double length { get; set; }
        public Double width { get; set; }
        public Double heigh { get; set; }
    }
}
