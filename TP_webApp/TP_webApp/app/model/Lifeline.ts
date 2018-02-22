import { OccurenceSpecification } from "./OccurenceSpecification";
import { LifelineView } from "../view/LifelineView";
import { Layer } from "./Layer";
import { BusinessElement } from "./BusinessElement";

export class Lifeline extends BusinessElement{
    name:string;
    type:string;
    occurenceSpecifications:OccurenceSpecification[];

    private _layer: Layer;

    constructor(name:string,type:string,occurence:OccurenceSpecification[], layer: Layer){
        super();
        this.name = name;
        this.type = type;
        this.layer = layer;
        this.occurenceSpecifications = occurence;

    }

    
    public get layer() : Layer {
        return this._layer;
    }

    
    public set layer(v : Layer) {
        this._layer = v;
    }
    
    AddOccurenceSpecification(occurenceSpecification:OccurenceSpecification){
        this.occurenceSpecifications.push(occurenceSpecification);
    }

    public delete() {
        console.log(this.layer.messages)
        for (let message of this.occurenceSpecifications.map(e => e.message)) {
            console.log("BLABAAARAGs");
            
            message.start.at.occurenceSpecifications.splice(message.start.at.occurenceSpecifications.indexOf(message.start),1);
            message.end.at.occurenceSpecifications.splice(message.end.at.occurenceSpecifications.indexOf(message.end),1);
            this.layer.messages.splice(this.layer.messages.indexOf(message),1);
            console.log(message.graphicElement);
            this.layer.graphicElement.remove(message.graphicElement);
          
        }
        this.layer.lifelines.splice(this.layer.lifelines.indexOf(this),1);
        
        this.layer.graphicElement.remove(this.graphicElement);
       
    }
}


    