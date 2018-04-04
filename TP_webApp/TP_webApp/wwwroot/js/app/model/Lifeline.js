import { LayerElement } from "./LayerElement";
export class Lifeline extends LayerElement {
    constructor() {
        super(...arguments);
        this.__occurenceSpecifications = [];
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get occurenceSpecifications() {
        return this.__occurenceSpecifications;
    }
    set occurenceSpecifications(occurenceSpecifications) {
        this.__occurenceSpecifications = occurenceSpecifications;
    }
}
//# sourceMappingURL=Lifeline.js.map