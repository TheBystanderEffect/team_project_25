import { Geometry, Material, Mesh, Scene, Vector3, Object3D } from 'three'
import { CustomMesh } from './CustomMesh'
import { BusinessElement } from '../model/BusinessElement';

export class GraphicElement extends Object3D{

    public width: number;
    public height: number;
    public geometry: Geometry;
    public material: Material;
    public mesh: CustomMesh; //primarny mesh elementu
    public businessElement: BusinessElement;//binis objekt

    public constructor(businessElement:BusinessElement){
        super();
        this.businessElement = businessElement;
        this.businessElement.graphicElement = this;
    }

    //deprecated
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
