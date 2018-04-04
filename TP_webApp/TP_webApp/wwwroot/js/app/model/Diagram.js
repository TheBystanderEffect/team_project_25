import { BusinessElement } from "./BusinessElement";
export class Diagram extends BusinessElement {
    constructor() {
        super(...arguments);
        this._layers = [];
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get layers() {
        return this._layers;
    }
    set layers(layers) {
        this._layers = layers;
    }
}
//# sourceMappingURL=Diagram.js.map