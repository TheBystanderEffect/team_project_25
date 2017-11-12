import {Lifeline} from "./Lifeline";
import {CombinedFragment} from "./CombinedFragment";
import {Message} from "./Message";

export class Layer{
    
        lifelines:Lifeline[];
        combinedFragments:CombinedFragment[];
        messages:Message[];
    
        constructor(lifelines:Lifeline[],combinedFragments:CombinedFragment[],messages:Message[]){
            this.lifelines = lifelines;
            this.combinedFragments = combinedFragments;
            this.messages = messages;
    
        }
    
        AddMessage(message:Message) {
                this.messages.push(message)
        }

        AddLifeline(lifelines:Lifeline){
            this.lifelines.push(lifelines);
        }
    
    
    
    }
    