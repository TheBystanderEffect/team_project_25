import { InteractionFragment } from "./InteractionFragment";
export var InteractionOperator;
(function (InteractionOperator) {
    InteractionOperator["ALT"] = "ALT";
    InteractionOperator["OPT"] = "OPT";
    InteractionOperator["LOOP"] = "LOOP";
    InteractionOperator["PAR"] = "PAR";
})(InteractionOperator || (InteractionOperator = {}));
export class CombinedFragment extends InteractionFragment {
    constructor() {
        super(...arguments);
        this._children = [];
    }
    get interactionOperator() {
        return this._interactionOperator;
    }
    set interactionOperator(interactionOperator) {
        this._interactionOperator = interactionOperator;
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
    get messages() {
        return this.children.map(e => e.messages).reduce((a, v) => a.concat(v));
    }
    set messages(messages) {
        throw new Error("LogicError: Setting messages on a combined fragment is not defined");
    }
}
//# sourceMappingURL=CombinedFragment.js.map