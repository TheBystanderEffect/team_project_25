import {Lifeline} from "./Lifeline";
import {CombinedFragment} from "./CombinedFragment";
import {Message} from "./Message";
import { BusinessElement } from "./BusinessElement";

export class Layer extends BusinessElement{
    
        lifelines:Lifeline[];
        combinedFragments:CombinedFragment[];
        messages:Message[];
    
        constructor(lifelines:Lifeline[],combinedFragments:CombinedFragment[],messages:Message[]){
            super();
            this.lifelines = lifelines;
            this.combinedFragments = combinedFragments;
            this.messages = messages;
        }
    
        AddMessage(message:Message) {
                this.messages.push(message);
        }

        AddLifeline(lifelines:Lifeline){
            this.lifelines.push(lifelines);
        }
    
        lopata(){
            console.log("TEST SUCCESS!");
        }
    
    }
    