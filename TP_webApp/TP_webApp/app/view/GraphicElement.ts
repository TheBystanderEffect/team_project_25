import { Geometry, Material, Mesh, Scene, Vector3 } from 'three'
import { CustomMesh } from './CustomMesh'

export class GraphicElement{
    // public x: number;
    // public y: number;
    // public z: number;

    //public position: Vector3; //center of element, x,y,z

    public width: number;
    public height: number;
    public geometry: Geometry;
    public material: Material;
    public mesh: CustomMesh;
    public parent: Object;//binis objekt

    public constructor(parent:Object){
        this.parent = parent;
    }

    public draw(targetScene: Scene): void {
        targetScene.add(this.mesh);
    }

    public getPosition():Vector3{
        return this.mesh.position;
    }
    public setPosition(newPos: Vector3):void{
        this.mesh.position = newPos;
    }
}
