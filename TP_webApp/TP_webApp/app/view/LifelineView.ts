import { Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';
import { TextView } from "./TextView"
import { Lifeline } from '../model/Lifeline';
import * as Config from "../config"
import { LayerView } from './LayerView';
import { ASSETS } from "../globals";

export class LifelineView extends GraphicElement {
    //substituted by getters
    //private _length: number; //this.line.scale.y
    //private _center: Vector3; //center of mesh in relation to layer, probably not needed
    //private _source: Vector3; //source in relation to layer

    private line: CustomMesh;
    private text: CustomMesh;

    //override of object3D parent
    parent: LayerView;
    //override
    businessElement: Lifeline;

    public constructor(parent:BusinessElement) {
        super(parent);
        this.line = new CustomMesh(
            ASSETS.lifelineBodyGeometry,
            ASSETS.lifelineBodyMaterial
        );
        this.add(this.line);
        //do text as well
        // this.text = new CustomMesh( TextView.makeText((this.businessElement as Lifeline).name), this.material );
        // this.add(this.text);
    }

    public updateLayout(index: number):LifelineView{
        if(!this.text){
            this.text = new CustomMesh(
                TextView.makeText(this.businessElement.name), 
                ASSETS.textMaterial
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

}