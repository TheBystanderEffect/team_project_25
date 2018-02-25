import { Object3D } from 'three';
export class DiagramView extends Object3D {
    constructor(diagram) {
        super();
        this._diagram = diagram;
        return this;
    }
    get diagram() {
        return this._diagram;
    }
}
//# sourceMappingURL=DiagramView.js.map