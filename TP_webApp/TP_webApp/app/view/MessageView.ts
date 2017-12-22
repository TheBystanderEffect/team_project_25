import { CylinderGeometry, MeshBasicMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';
import { Message } from '../model/Message';
import { LifelineView } from './LifelineView';
import * as Config from "../config"
import { TextView } from './TextView';

export class MessageView extends GraphicElement{
    //mesh.metadata.parent: MessageView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    private _length: number;
    private _center: Vector3;

    private arrowBody: CustomMesh;
    //private arrowHead: CustomMesh;
    private text: CustomMesh;

    //override
    businessElement: Message;

    public constructor(parent:BusinessElement) {
        super(parent);

        this._length = 1;
        //TODO pull geom and texture from some common resource
        // this.geometry = new CylinderGeometry( 0.5, 2.5, 1, 8 );
        // this.material = new MeshBasicMaterial( {color: 0x00FF00} );
        this.arrowBody = new CustomMesh(
            new CylinderGeometry( 0.5, 2.5, 1, 8 ), 
            new MeshBasicMaterial( {color: 0x00FF00})
        );
        this.arrowBody.position.set(0,0,0);

        this.add(this.arrowBody)

        return this;
    }
    // public constructor(parent:BusinessElement,source_x:number, source_y:number, source_z:number, destination_x:number, destination_y:number, destination_z:number) {
    //     super(parent);
    //     this.length = Math.sqrt(Math.pow(source_x-destination_x,2)+Math.pow(source_y-destination_y,2)+Math.pow(source_z-destination_z,2))
    //     this.center = new Vector3((source_x + destination_x)/2, (source_y + destination_y)/2, (source_z + destination_z)/2)
    //     //maybe keep start and end as V3 as well

    //     this.geometry = new CylinderGeometry( 0.5, 2.5, 1, 8 );
    //     this.material = new MeshBasicMaterial( {color: 0x00FF00} );
    //     this.mesh = new CustomMesh( this.geometry, this.material );
    //     this.mesh.position.set(0,0,0)
    //     this.mesh.rotateZ(Math.atan2(destination_y-source_y, destination_x-source_x)-Math.PI/2)
    //     this.mesh.rotateX(Math.atan2(destination_z-source_z, destination_y-source_y))
    //     this.position.set(this.center.x, this.center.y, this.center.z)
    //     this.add(this.mesh)

    //     this.mesh.scale.setY(this.length);
    
    //     //this.mesh.metadata = {}
    //     this.mesh.metadata.parent=this

    //     return this;
    // }  
    
    public updateLayout(index: number):MessageView{
        var start = (this.businessElement.start.at.graphicElement as LifelineView).source;
        var end = (this.businessElement.end.at.graphicElement as LifelineView).source;

        this._length = Math.sqrt(Math.pow(start.x-end.x,2)+Math.pow(start.y-end.y,2)+Math.pow(start.z-end.z,2));
        this.position.set(
            (start.x + end.x)/2, 
            start.y-Config.firstMessageOffset-Config.messageOffset*index,
            (start.z + end.z)/2
        );
        this.arrowBody.scale.setY(this._length); 

        // this.arrowBody.rotateZ(Math.atan2(end.y-start.y, end.x-start.x)-Math.PI/2)
        // this.arrowBody.rotateX(Math.atan2(end.z-start.z, end.y-start.y))
        this.arrowBody.rotation.x = Math.atan2(end.z-start.z, end.y-start.y);
        this.arrowBody.rotation.z = Math.atan2(end.y-start.y, end.x-start.x)-Math.PI/2;

        //text
        if(!this.text){
            this.text = new CustomMesh(
                TextView.makeText((this.businessElement as Message).name),
                new MeshBasicMaterial( {color: 0x000000})
            );
            this.text.position.set(-10,5,0); //and make the alignment not special
            this.add(this.text);
        }else{
            //if text changed -> make new text
            //?make text a object with string of its text and update on it, 
            //have it chenge its mash from passed text if need be
        }
        return this;
    }

    // public static messageViewByVectors(parent: BusinessElement, source: Vector3, destination:Vector3):MessageView {
    //     return new MessageView(parent, source.x,source.y,source.z,destination.x,destination.y,destination.z)
    // }

}
