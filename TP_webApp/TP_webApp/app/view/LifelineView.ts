import { CylinderGeometry, MeshBasicMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { lifelineRadius } from "../config"
import { BusinessElement } from '../model/BusinessElement';

export class LifelineView extends GraphicElement{
    //mesh.metadata.parent: MessageView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    public length: number;
    public center: Vector3; //center of mesh in relation to layer, probably not needed
    _source: Vector3; //source in relation to layer

    public constructor(parent:BusinessElement,source_x:number, source_y:number, source_z:number, length:number) {
        super(parent);
        this.length = length;
        this._source = new Vector3(source_x,source_y,source_z);
        this.center = new Vector3(source_x, source_y - length/2, source_z);
    
        this.geometry = new CylinderGeometry(lifelineRadius, lifelineRadius, 1, 8 )//this.length, 8 );
        this.material = new MeshBasicMaterial( {color: 0xFF0000} );
        this.mesh = new CustomMesh( this.geometry, this.material );
        this.mesh.position.set(0,-length/2,0);// = this.center;//.set(0,0,0);
        this.mesh.scale.set(1,this.length,1);
    
        this.mesh.metadata = {};
        this.mesh.metadata.parent=this;

        this.position.copy(this.source);//.set(this.center.x, this.center.y, this.center.z);
        this.add(this.mesh);
    }  
    
    get source():Vector3{
        return this._source;
    }

    set source(newSource: Vector3){
        this._source=newSource;
    }

}