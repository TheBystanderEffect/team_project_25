import { CylinderGeometry, MeshBasicMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";

export class LifelineView extends GraphicElement{
    //mesh.metadata.parent: MessageView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    public length: number;
    public center: Vector3;

    public constructor(source_x:number, source_y:number, source_z:number, length:number) {
        super();
        this.length = length;
        this.center = new Vector3(source_x, source_y - length/2, source_z);
    
        this.geometry = new CylinderGeometry( 3, 3, this.length, 8 );
        this.material = new MeshBasicMaterial( {color: 0xFF0000} );
        this.mesh = new CustomMesh( this.geometry, this.material );
        this.mesh.position.set(this.center.x, this.center.y, this.center.z);
    
        this.mesh.metadata = {}
        this.mesh.metadata.parent=this

        return this;
    }    

}