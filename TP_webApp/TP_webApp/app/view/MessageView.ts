import { CylinderGeometry, MeshBasicMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';

export class MessageView extends GraphicElement{
    //mesh.metadata.parent: MessageView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    public length: number;
    public center: Vector3;

    public constructor(parent:BusinessElement,source_x:number, source_y:number, source_z:number, destination_x:number, destination_y:number, destination_z:number) {
        super(parent);
        this.length = Math.sqrt(Math.pow(source_x-destination_x,2)+Math.pow(source_y-destination_y,2)+Math.pow(source_z-destination_z,2))
        this.center = new Vector3((source_x + destination_x)/2, (source_y + destination_y)/2, (source_z + destination_z)/2)
        //maybe keep start and end as V3 as well

        this.geometry = new CylinderGeometry( 0.5, 2.5, 1, 8 );
        this.material = new MeshBasicMaterial( {color: 0x00FF00} );
        this.mesh = new CustomMesh( this.geometry, this.material );
        this.mesh.position.set(0,0,0)
        this.mesh.rotateZ(Math.atan2(destination_y-source_y, destination_x-source_x)-Math.PI/2)
        this.mesh.rotateX(Math.atan2(destination_z-source_z, destination_y-source_y))
        this.position.set(this.center.x, this.center.y, this.center.z)
        this.add(this.mesh)

        this.mesh.scale.setY(this.length);
    
        this.mesh.metadata = {}
        this.mesh.metadata.parent=this

        return this;
    }    

    public static messageViewByVectors(parent: BusinessElement, source: Vector3, destination:Vector3):MessageView {
        return new MessageView(parent, source.x,source.y,source.z,destination.x,destination.y,destination.z)
    }

}