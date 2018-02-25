import { PlaneGeometry, MeshLambertMaterial, Vector3 } from 'three';
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
export class LayerView extends GraphicElement {
    constructor(parent, x, y, z, width, height) {
        super(parent);
        this.width = width;
        this.height = height;
        this.source = new Vector3(-width / 2, height / 2, 0);
        this.geometry = new PlaneGeometry(1, 1);
        this.material = new MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
        this.mesh = new CustomMesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, 0);
        this.mesh.scale.set(width, height, 1);
        this.mesh.metadata = {};
        this.mesh.metadata.parent = this;
        this.position.set(x, y, z);
        this.add(this.mesh);
        //this.type = 1 //obsolete
        return this;
    }
    layer_simple(parent, layerNumber) {
        return new LayerView(parent, 0, 0, -1000 * layerNumber, 500, 600);
    }
    get source() {
        return this._source;
    }
    set source(source) {
        this._source = source;
    }
}
//# sourceMappingURL=LayerView.js.map