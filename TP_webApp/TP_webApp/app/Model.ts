class Model{
    metaData:object;
    layers:Layer[];



}


class Layer{

    lifelines:Lifeline[];
    combinedFragments:CombinedFragment[];
    messages:Message[];
    position:Position;

    constructor(lifelines:Lifeline[],combinedFragments:CombinedFragment[],messages:Message[],position:Position){
        this.lifelines = lifelines;
        this.combinedFragments = combinedFragments;
        this.messages = messages;
        this.position = position;

    }

    AddMessage(message:Message) {
            this.messages.push(message)
    }



}

class Lifeline{

}

class CombinedFragment{

}

enum kinds { "complete", "lost", "found", "unknow" };
enum sorts { "synchCall", "asynchCall", "asynchSignal", "createMessage", "deleteMessage", "reply" };

class Message{
    name:string;
    sort:sorts;
    kind:kinds;
    start:Lifeline;
    end:Lifeline;
    constructor(name:string,sort:sorts,kind:kinds,start:Lifeline,end:Lifeline){
        this.name = name;   
        this.kind = kind;
        this.sort = sort;
        this.start = start;
        this.end = end;
    }
}

