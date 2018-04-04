import { GraphicElement } from "./GraphicElement";
export class DiagramView extends GraphicElement {
    constructor(diagram) {
        super(diagram);
        this._diagram = diagram;
        return this;
    }
    get diagram() {
        return this._diagram;
    }
}
//# sourceMappingURL=DiagramView.js.map