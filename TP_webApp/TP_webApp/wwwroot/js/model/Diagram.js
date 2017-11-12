export class Diagram {
    constructor() {
        this._layers = [];
    }
    get layers() {
        return this._layers;
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