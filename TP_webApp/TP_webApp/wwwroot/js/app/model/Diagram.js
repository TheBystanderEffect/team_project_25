import { BusinessElement } from "./BusinessElement";
import { CommunicationController } from '../controller/CommunicationController';
export class Diagram extends BusinessElement {
    constructor(_layers, _diagramView, verId = 0) {
        super();
        this._layers = _layers ? _layers : [];
        this._verId = verId;
        console.log("Getting ID from server....");
        this._diagramId = CommunicationController.instance.getNewDiagramId();
        // this._diagramId = 42;
    }
    get layers() {
        return this._layers;
    }
    get diagramId() {
        return this._diagramId;
    }
    set layers(layers) {
        this._layers = layers;
    }
    addLayer(layer) {
        this._layers.push(layer);
    }
    get diagramView() {
        return this._diagramView;
    }
    set diagramView(diagramView) {
        this._diagramView = diagramView;
    }
}
//# sourceMappingURL=Diagram.js.map