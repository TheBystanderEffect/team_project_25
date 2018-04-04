import { LayerElement } from "./LayerElement";
export class OccurenceSpecification extends LayerElement {
    get lifeline() {
        return this.__lifeline;
    }
    set lifeline(lifeline) {
        this.__lifeline = lifeline;
    }
    toJSON() {
        return {
            layer: this.diagram.layers.indexOf(this.layer),
            lifeline: this.layer.lifelines.indexOf(this.lifeline),
            index: this.lifeline.occurenceSpecifications.indexOf(this)
        };
    }
}
export class MessageOccurenceSpecification extends OccurenceSpecification {
    get message() {
        return this.__message;
    }
    set message(message) {
        this.__message = message;
    }
}
export class OperandOccurenceSpecification extends OccurenceSpecification {
    get startsOperand() {
        return this.__startsOperand;
    }
    set startsOperand(startsOperand) {
        this.__startsOperand = startsOperand;
    }
    get endsOperand() {
        return this.__startsOperand;
    }
    set endsOperand(endsOperand) {
        this.__endsOperand = endsOperand;
    }
}
//# sourceMappingURL=OccurenceSpecification.js.map