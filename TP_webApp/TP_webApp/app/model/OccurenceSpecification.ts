import { Lifeline } from "./Lifeline";
import { LayerElement } from "./LayerElement";
import { Message } from "./Message";
import { InteractionOperand } from "./InteractionOperand";

export abstract class OccurenceSpecification extends LayerElement {

    protected __lifeline: Lifeline;

    public get lifeline(): Lifeline {
        return this.__lifeline;
    }

    public set lifeline(lifeline: Lifeline) {
        this.__lifeline = lifeline;
    }

    public toJSON(): any {
        return {
            layer: this.diagram.layers.indexOf(this.layer),
            lifeline: this.layer.lifelines.indexOf(this.lifeline),
            index: this.lifeline.occurenceSpecifications.indexOf(this)
        };
    }

}

export class MessageOccurenceSpecification extends OccurenceSpecification {

    protected __message: Message;

    public get message(): Message {
        return this.__message;
    }

    public set message(message: Message) {
        this.__message = message;
    }

}

export class OperandOccurenceSpecification extends OccurenceSpecification {

    // only interaction operands are allowed - a combined fragment is bounded by the aggregation of its operands
    protected __operand: InteractionOperand;

    public get operand(): InteractionOperand {
        return this.__operand;
    }

    public set operand(operand: InteractionOperand) {
        this.__operand = operand;
    }

}