import { InteractionFragment } from "./InteractionFragment";
export class InteractionOperand extends InteractionFragment {
    constructor() {
        super(...arguments);
        this._children = [];
    }
    get interactionConstraint() {
        return this._interactionConstraint;
    }
    set interactionConstraint(interactionConstraint) {
        this._interactionConstraint = interactionConstraint;
    }
    get parent() {
        return this.__parent;
    }
    set parent(parent) {
        this.__parent = parent;
    }
    get children() {
        return this._children;
    }
    set children(children) {
        this._children = children;
    }
    get startingOccurences() {
        return this._startingOccurences;
    }
    set startingOccurences(startingOccurences) {
        this._startingOccurences = startingOccurences;
    }
    get endingOccurences() {
        return this._endingOccurences;
    }
    set endingOccurences(endingOccurences) {
        this._endingOccurences = endingOccurences;
    }
}
//# sourceMappingURL=InteractionOperand.js.map