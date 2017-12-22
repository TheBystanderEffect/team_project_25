import { CylinderGeometry, MeshBasicMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';
import { TextView } from "./TextView"
import { Lifeline } from '../model/Lifeline';
import * as Config from "../config"
import { LayerView } from './LayerView';

export class LifelineView extends GraphicElement {
    //are all thease needed?
    //private _length: number; //this.line.scale.y
    //private _center: Vector3; //center of mesh in relation to layer, probably not needed
    //private _source: Vector3; //source in relation to layer

    private line: CustomMesh;
    private text: CustomMesh;

    //override of object3D parent
    parent: LayerView;

    public constructor(parent:BusinessElement) {
        super(parent);
        //TODO pull geom and texture from some common resource
        // this.geometry = new CylinderGeometry(Config.lifelineRadius, Config.lifelineRadius, 1, 8 );//this.length, 8 );
        // this.material = new MeshBasicMaterial( {color: 0xFF0000} );
        //................................
        this.line = new CustomMesh(
            new CylinderGeometry(Config.lifelineRadius, Config.lifelineRadius, 1, 8 ), 
            new MeshBasicMaterial( {color: 0xFF0000} ) 
        );
        this.add(this.line);
        //do text as well
        // this.text = new CustomMesh( TextView.makeText((this.businessElement as Lifeline).name), this.material );
        // this.add(this.text);
    }

    // public constructor(parent:BusinessElement,source_x:number, source_y:number, source_z:number, length:number) {
    //     super(parent);
    //     this.length = length;
    //     this._source = new Vector3(source_x,source_y,source_z);
    //     this.center = new Vector3(source_x, source_y - length/2, source_z);
    
    //     this.geometry = new CylinderGeometry(lifelineRadius, lifelineRadius, 1, 8 );//this.length, 8 );
    //     this.material = new MeshBasicMaterial( {color: 0xFF0000} );
    //     this.mesh = new CustomMesh( this.geometry, this.material );
    //     this.mesh.position.set(0,-length/2,0);// = this.center;//.set(0,0,0);
    //     this.mesh.scale.set(1,this.length,1);
    
    //     this.mesh.metadata = {};
    //     this.mesh.metadata.parent=this;

    //     this.position.copy(this.source);//.set(this.center.x, this.center.y, this.center.z);
    //     this.add(this.mesh);
    // }

    public updateLayout(index: number):LifelineView{
        if(!this.text){
            this.text = new CustomMesh(
                TextView.makeText((this.businessElement as Lifeline).name), 
                new MeshBasicMaterial( {color: 0x000000})
            );
            this.text.position.set(-10,5,0); //and make the alignment not special
            this.add(this.text);
        }else{
            //if text changed -> make new text
            //?make text a object with string of its text and update on it, 
            //have it chenge its mash from passed text if need be

        }

        this.position.set(this.parent.source.x + Config.firstLifelineOffsetX + Config.lifelineOffsetX*index,
            this.parent.source.y - Config.lifelineOffsetY,
            0);
        this.line.scale.setY(this.parent.height-Config.lifelineOffsetY);
        // this._length = this.parent.height-Config.lifelineOffsetY;
        // this.line.scale.set(1,this.length,1);
        this.line.position.set(0, -this.length/2, 0);

        return this;
    }

    get length():number{
        //return this._length;
        return this.line.scale.y
    }

    get source():Vector3{
        return this.position;
    }

    // get center():Vector3{
    //     return this._center;
    // }
    
    // set source(newSource: Vector3){
    //     this._source=newSource;
    // }

}