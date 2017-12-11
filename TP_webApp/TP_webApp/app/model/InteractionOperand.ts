import { CombinedFragment } from "./CombinedFragment";
import {Message} from "./Message";

export class InteractionOperand{
    interactionConstraint: string;
    combinedFragment:CombinedFragment[];
    messages:Message[];

    constructor(interactionConstraint: string, combinedFragment:CombinedFragment[], messages:Message[]){
        this.interactionConstraint = interactionConstraint;
        this.combinedFragment = combinedFragment;
        this.messages = messages;
    }
}