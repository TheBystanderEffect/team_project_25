import { Vector3 } from 'three';
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import * as Config from "../config";
import { ASSETS } from "../globals";
export class LayerView extends GraphicElement {
    constructor(parent) {
        super(parent);
        //this.width=1;
        //this.height=1;
        this._source = new Vector3(-Config.layerWidth / 2, Config.layerHeight / 2, 0);
        this.rectangle = new CustomMesh(ASSETS.layerRectangleGeometry, ASSETS.layerRectangleMaterial);
        this.add(this.rectangle);
        //TODO better text handling
        return this;
    }
    updateLayout(dynamicLayerWidth, dynamicLayerHeight, index) {
        this.position.set(0, 0, -Config.firstLayerOffset - Config.layerOffset * index);
        this.rectangle.scale.set(dynamicLayerWidth, dynamicLayerHeight, 1);
        this.rectangle.position.set(dynamicLayerWidth / 2 - Config.layerWidth / 2, -dynamicLayerHeight / 2 + Config.layerHeight / 2, 0);
        //this._source.set(-dynamicLayerWidth/2,dynamicLayerHeight/2,0);
        //not needed,probably
        //this.width=dynamicLayerWidth;
        //this.height=dynamicLayerHeight;
        return this;
    }
    get source() {
        return this._source;
    }
    get width() {
        return this.rectangle.scale.x;
    }
    get height() {
        return this.rectangle.scale.y;
    }
}
//# sourceMappingURL=LayerView.js.map