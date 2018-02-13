import { OccurenceSpecification } from "./OccurenceSpecification"
import { Layer } from "./Layer";
export enum kinds { "complete", "lost", "found", "unknown" };
export enum sorts { "synchCall", "asynchCall", "asynchSignal", "createMessage", "deleteMessage", "reply" };
import { BusinessElement } from "./BusinessElement";

export class Message extends BusinessElement{

    _name: string;
    _sort: sorts;
    _kind: kinds;
    _start: OccurenceSpecification;
    _end: OccurenceSpecification;

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get sort(): sorts {
        return this._sort;
    }

    public set sort(sort: sorts) {
        this._sort = sort;
    }

    public get kind(): kinds {
        return this._kind;
    }

    public set kind(kind: kinds) {
        this._kind = kind;
    }

    public get start(): OccurenceSpecification {
        return this._start;
    }

    public set start(start: OccurenceSpecification) {
        this._start = start;
    }

    public get end(): OccurenceSpecification {
        return this._end;
    }

    public set end(end: OccurenceSpecification) {
        this._end = end;
    }

    public get parentLayer(): Layer {
        return this.start.at.layer;
    }

    constructor(name:string,sort:sorts,kind:kinds,start:OccurenceSpecification,end:OccurenceSpecification) {
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

