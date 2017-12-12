import { OccurenceSpecification } from "./OccurenceSpecification"
import { Layer } from "./Layer";
enum kinds { "complete", "lost", "found", "unknown" };
enum sorts { "synchCall", "asynchCall", "asynchSignal", "createMessage", "deleteMessage", "reply" };
import { BusinessElement } from "./BusinessElement";

export class Message extends BusinessElement{

    name: string;
    sort: sorts;
    kind: kinds;
    start: OccurenceSpecification;
    end: OccurenceSpecification;

    public get parentLayer(): Layer {
        return this.start.at.layer;
    }

    constructor(name:string,sort:sorts,kind:kinds,start:OccurenceSpecification,end:OccurenceSpecification){
        super();
        this.name = name;   
        this.kind = kind;
        this.sort = sort;
        this.start = start;
        this.end = end;
    }

    public delete() {
        console.log("deleting message")
            
            this.start.at.occurenceSpecifications.splice(this.start.at.occurenceSpecifications.indexOf(this.start),1);
            this.end.at.occurenceSpecifications.splice(this.end.at.occurenceSpecifications.indexOf(this.end),1);
            this.start.at.layer.messages.splice(this.start.at.layer.messages.indexOf(this),1);
            //this.end.at.layer.messages.splice(this.end.at.layer.messages.indexOf(this),1)

            this.parentLayer.graphicElement.remove(this.graphicElement);

    }
}

