import { Vector3, Euler } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { Message } from '../model/Message';
import { LifelineView } from './LifelineView';
import * as Config from "../config"
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';
import { BusinessElement } from '../model/BusinessElement';
import { CombinedFragment, InteractionOperator } from '../model/CombinedFragment';
import { InteractionOperand } from '../model/InteractionOperand';

export class OperandView extends GraphicElement{
    private _length: number;
    //private _center: Vector3;

    private operatorText: Text3D;
    
    private _source: Vector3;
    public _destination: Vector3;

    private animation = {
        start : {
            source: new Vector3(0,0,0),
            destination: new Vector3(0,0,0)
        },
        end : {
            source: new Vector3(0,0,0),
            destination: new Vector3(0,0,0)
        }
    }

    //override
    businessElement: CombinedFragment;

    public constructor(parent:BusinessElement) {
        super(parent);
        this._source = new Vector3(0,0,0);
        this._destination = new Vector3(0,0,0);

        this.operatorText = new Text3D(this);
        this.add(this.operatorText);
    }
    
    public updateOperator(operator: InteractionOperator, position: Vector3){
        this.operatorText = new Text3D(this);
        this.operatorText.position.set(position.x, position.y, position.z);
        this.add(this.operatorText);
    }
}