import { LayerElement } from "./LayerElement";
export class InteractionFragment extends LayerElement {
    constructor() {
        super(...arguments);
        this._children = [];
        this._messages = [];
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
        return this._messages;
    }
    set messages(messages) {
        this._messages = messages;
    }
}
//# sourceMappingURL=InteractionFragment.js.map