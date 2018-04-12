import { Lifeline } from "./Lifeline";
import { LayerElement } from "./LayerElement";
import { StoredMessage } from "./Message";
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

    protected __message: StoredMessage;

    public get message(): StoredMessage {
        return this.__message;
    }

    public set message(message: StoredMessage) {
        this.__message = message;
    }

}

export class OperandOccurenceSpecification extends OccurenceSpecification {

    // only interaction operands are allowed - a combined fragment is bounded by the aggregation of its operands
    protected __startsOperand: InteractionOperand; // the operand started by this occurence
    protected __endsOperand: InteractionOperand; // the operand ended by this occurenc

    public get startsOperand(): InteractionOperand {
        return this.__startsOperand;
    }

    public set startsOperand(startsOperand: InteractionOperand) {
        this.__startsOperand = startsOperand;
    }

    public get endsOperand(): InteractionOperand {
<<<<<<< HEAD
        return this.__endsOperand;
=======
        return this.__startsOperand;
>>>>>>> dev
    }

    public set endsOperand(endsOperand: InteractionOperand) {
        this.__endsOperand = endsOperand;
    }

}