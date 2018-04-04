import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import * as Config from "../config";
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';
export class LifelineView extends GraphicElement {
    constructor(parent) {
        super(parent);
        this.line = new CustomMesh(ASSETS.lifelineBodyGeometry, ASSETS.lifelineBodyMaterial);
        this.add(this.line);
        this.text = new Text3D(this);
        this.add(this.text);
    }
    updateLayout(index) {
        this.position.set(this.parent.source.x + Config.firstLifelineOffsetX + Config.lifelineOffsetX * index, this.parent.source.y - Config.lifelineOffsetY, 0);
        this.line.scale.setY(this.parent.height - Config.lifelineOffsetY);
        // this._length = this.parent.height-Config.lifelineOffsetY;
        // this.line.scale.set(1,this.length,1);
        this.line.position.set(0, -this.length / 2, 0);
        this.text.update(this.businessElement.name);
        return this;
    }
    get length() {
        //return this._length;
        return this.line.scale.y;
    }
    get source() {
        return this.position;
    }
}
//# sourceMappingURL=LifelineView.js.map