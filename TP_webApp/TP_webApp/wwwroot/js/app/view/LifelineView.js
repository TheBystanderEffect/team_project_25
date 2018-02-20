import { CylinderGeometry, MeshBasicMaterial, Vector3 } from 'three';
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { lifelineRadius } from "../config";
export class LifelineView extends GraphicElement {
    constructor(parent, source_x, source_y, source_z, length) {
        super(parent);
        this.length = length;
        this._source = new Vector3(source_x, source_y, source_z);
        this.center = new Vector3(source_x, source_y - length / 2, source_z);
        this.geometry = new CylinderGeometry(lifelineRadius, lifelineRadius, 1, 8); //this.length, 8 );
        this.material = new MeshBasicMaterial({ color: 0xFF0000 });
        this.mesh = new CustomMesh(this.geometry, this.material);
        this.mesh.position.set(0, -length / 2, 0); // = this.center;//.set(0,0,0);
        this.mesh.scale.set(1, this.length, 1);
        this.mesh.metadata = {};
        this.mesh.metadata.parent = this;
        this.position.copy(this.source); //.set(this.center.x, this.center.y, this.center.z);
        this.add(this.mesh);
    }
    get source() {
        return this._source;
    }
    set source(newSource) {
        this._source = newSource;
    }
}
//# sourceMappingURL=LifelineView.js.map