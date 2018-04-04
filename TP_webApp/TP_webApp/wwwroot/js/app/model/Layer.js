import { DiagramElement } from "./DiagramElement";
export class Layer extends DiagramElement {
    constructor() {
        super(...arguments);
        this._lifelines = [];
        this._messages = [];
        this._fragments = [];
    }
    get lifelines() {
        return this._lifelines;
    }
    set lifelines(lifelines) {
        this._lifelines = lifelines;
    }
    get messages() {
        return this._messages;
    }
    set messages(messages) {
        this._messages = messages;
    }
    get fragments() {
        return this._fragments;
    }
    set fragments(fragments) {
        this._fragments = fragments;
    }
}
//# sourceMappingURL=Layer.js.map