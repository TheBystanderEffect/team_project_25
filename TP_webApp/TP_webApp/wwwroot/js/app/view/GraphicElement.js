import { Object3D } from 'three';
export class GraphicElement extends Object3D {
    constructor(businessElement) {
        super();
        // defaults to lerp
        this.animator = (start, end, progress) => {
            //console.log(end);
            return start.clone().multiplyScalar(1 - progress).add(end.clone().multiplyScalar(progress));
        };
        this.animationLength = 1;
        this.animationProgress = 1;
        this.businessElement = businessElement;
        this.businessElement.graphicElement = this;
    }
    // public getPosition():Vector3{
    //     return this.mesh.position;
    // }
    // public setPosition(newPos: Vector3):void{
    //     this.mesh.position = newPos;
    // }
    //this MAY be the solution
    // public get graphicElement():GraphicElement{
    //     return this;
    // }
    update(dt) {
        if (this.animationProgress < 1) {
            this.animationProgress = Math.min(1, this.animationProgress + dt / this.animationLength);
            this.animate();
        }
        for (let child of this.children) {
            if (child instanceof GraphicElement) {
                child.update(dt);
            }
        }
        // update self
        // update children
    }
    animate() {
    }
    toJSON() {
        return undefined;
    }
}
//# sourceMappingURL=GraphicElement.js.map