import { Geometry, Material, Mesh, Scene, Vector3, Object3D } from 'three'
import { CustomMesh } from './CustomMesh'
import { BusinessElement } from '../model/BusinessElement';

export abstract class GraphicElement extends Object3D{

    public businessElement: BusinessElement;//binis objekt
    // defaults to lerp
    public animator: (start: Vector3, end: Vector3, progress: number) => Vector3 = (start, end, progress) => {
        //console.log(end);
        return start.clone().multiplyScalar(1 - progress).add(end.clone().multiplyScalar(progress));
    };

    public shouldAnimate: boolean = true;
    public animationLength: number = 1; //seconds
    public animationProgress: number = 1;

    public constructor(businessElement:BusinessElement){
        super();
        this.businessElement = businessElement;
        this.businessElement.graphicElement = this;
    }

    public update(dt: number): void {
        if(this.shouldAnimate){
            // update self
            if (this.animationProgress < 1) {
                this.animationProgress = Math.min(1, this.animationProgress + dt / this.animationLength);
                this.animate();
            }
        }
        // update children
        for (let child of this.children) {
            if (child instanceof GraphicElement) {
                child.update(dt);
            }
        }
        
    }

    public animate() {
        
    }

    public toJSON(): undefined {
        return undefined;
    }
}
