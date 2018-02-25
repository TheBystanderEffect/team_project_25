import { Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';
import { Lifeline } from '../model/Lifeline';
import * as Config from "../config"
import { LayerView } from './LayerView';
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';

export class LifelineView extends GraphicElement {
    //substituted by getters
    //private _length: number; //this.line.scale.y
    //private _center: Vector3; //center of mesh in relation to layer, probably not needed
    //private _source: Vector3; //source in relation to layer

    private line: CustomMesh;
    private text: Text3D;

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
        
        this.text = new Text3D(this);
        this.add(this.text);
    }

    public updateLayout(index: number):LifelineView{
        
        this.position.set(this.parent.source.x + Config.firstLifelineOffsetX + Config.lifelineOffsetX*index,
            this.parent.source.y - Config.lifelineOffsetY,
            0);
        this.line.scale.setY(this.parent.height-Config.lifelineOffsetY);
        // this._length = this.parent.height-Config.lifelineOffsetY;
        // this.line.scale.set(1,this.length,1);
        this.line.position.set(0, -this.length/2, 0);

        this.text.update(this.businessElement.name);

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