import { TextGeometry, MeshBasicMaterial } from 'three';
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { FONT } from "../globals";
export class TextView extends GraphicElement {
    //mesh.metadata.parent: MessageView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    //public length: number;
    //public center: Vector3;
    constructor(parent, source_x, source_y, source_z, text_string, text_size) {
        super(parent);
        this.geometry = new TextGeometry(text_string, {
            font: FONT,
            size: text_size,
            height: 1,
            curveSegments: 12,
        });
        this.material = new MeshBasicMaterial({ color: 0x000000 });
        this.mesh = new CustomMesh(this.geometry, this.material);
        this.mesh.position.set(source_x, source_y, source_z);
        this.mesh.metadata = {};
        this.mesh.metadata.parent = this;
        this.add(this.mesh);
        this.position.set(0, 0, 0);
        return (this);
    }
}
//# sourceMappingURL=TextView.js.map