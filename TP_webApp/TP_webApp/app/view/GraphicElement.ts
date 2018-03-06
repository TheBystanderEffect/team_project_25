import { Geometry, Material, Mesh, Scene, Vector3, Object3D } from 'three'
import { CustomMesh } from './CustomMesh'
import { BusinessElement } from '../model/BusinessElement';

export abstract class GraphicElement extends Object3D{

    public width: number;
    public height: number;
    public geometry: Geometry;
    public material: Material;
    public mesh: CustomMesh; //primarny mesh elementu
    public businessElement: BusinessElement;//binis objekt
    // defaults to lerp
    public animator: (start: Vector3, end: Vector3, progress: number) => Vector3 = (start, end, progress) => {
        //console.log(end);
        return start.clone().multiplyScalar(1 - progress).add(end.clone().multiplyScalar(progress));
    };

    public animationLength: number = 1;
    public animationProgress: number = 1;

    public constructor(businessElement:BusinessElement){
        super();
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

    public update(dt: number): void {
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

    public animate() {
        
    }
}