import {OccurenceSpecification} from "./OccurenceSpecification"
enum kinds { "complete", "lost", "found", "unknow" };
enum sorts { "synchCall", "asynchCall", "asynchSignal", "createMessage", "deleteMessage", "reply" };

export class Message{
    name:string;
    sort:sorts;
    kind:kinds;
    start:OccurenceSpecification;
    end:OccurenceSpecification;

    constructor(name:string,sort:sorts,kind:kinds,start:OccurenceSpecification,end:OccurenceSpecification){
        this.name = name;   
        this.kind = kind;
        this.sort = sort;
        this.start = start;
        this.end = end;
    }

    
}

