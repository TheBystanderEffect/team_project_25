import {Lifeline} from "./Lifeline";
import {CombinedFragment} from "./CombinedFragment";
import {Message} from "./Message";
export class Layer{
    
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
    