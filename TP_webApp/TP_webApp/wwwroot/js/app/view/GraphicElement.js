import { Object3D } from 'three';
export class GraphicElement extends Object3D {
    constructor(businessElement) {
        super();
        this.businessElement = businessElement;
        this.businessElement.graphicElement = this;
    }
    //deprecated
    draw(targetScene) {
        targetScene.add(this.mesh);
    }
    getPosition() {
        return this.mesh.position;
    }
    setPosition(newPos) {
        this.mesh.position = newPos;
    }
}
//# sourceMappingURL=GraphicElement.js.map