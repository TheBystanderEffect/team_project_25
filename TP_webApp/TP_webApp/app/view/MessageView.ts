import { Vector3, Euler } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';
import { Message } from '../model/Message';
import { LifelineView } from './LifelineView';
import * as Config from "../config"
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';

export class MessageView extends GraphicElement{
    private _length: number;
    //private _center: Vector3;

    private arrowBody: CustomMesh;
    private arrowHead: CustomMesh;
    private text: Text3D;

    private source: Vector3;
    private destination: Vector3;

    //override
    businessElement: Message;

    private index: number;

    public constructor(parent:BusinessElement) {
        super(parent);
        this.source = new Vector3(0,0,0);
        this.destination = new Vector3(0,0,0);

        this.arrowBody = new CustomMesh(
            ASSETS.messageArrowBodyGeometry, 
            ASSETS.messageArrowBodyMaterial
        );
        this.arrowBody.position.set(0,0,0);
        this.add(this.arrowBody)

        this.arrowHead = new CustomMesh(
            ASSETS.messageArrowHeadGeometry, 
            ASSETS.messageArrowHeadMaterial
        );
        this.arrowHead.position.set(0,0,0);
        this.add(this.arrowHead)

        this.text = new Text3D(this);
        this.add(this.text);

        return this;
    }
    
    public updateLayout(index: number):MessageView{
        this.index = index;
        //calculate where the start,end points should be
        var start = (this.businessElement.start.at.graphicElement as LifelineView).source.clone();
        var end = (this.businessElement.end.at.graphicElement as LifelineView).source.clone();
        start.y += -Config.firstMessageOffset-Config.messageOffset*index
        end.y += -Config.firstMessageOffset-Config.messageOffset*index

        //update only if current and correct points mismatch
        if( !(this.source.equals(start) && this.destination.equals(end)) ){
            this.source.copy(start);
            this.destination.copy(end);
            this.redraw();
        }
       
        this.text.update(this.businessElement.name);

        return this;
    }

    private redraw(){
        this._length = Math.sqrt(Math.pow(this.source.x-this.destination.x,2)
                                +Math.pow(this.source.y-this.destination.y,2)
                                +Math.pow(this.source.z-this.destination.z,2));
        this.position.set(
            (this.source.x + this.destination.x)/2, 
            (this.source.y + this.destination.y)/2,
            (this.source.z + this.destination.z)/2
        );

        let dirEuler = new Euler(
            Math.atan2(this.destination.z-this.source.z, this.destination.y-this.source.y),
            0,
            Math.atan2(this.destination.y-this.source.y, this.destination.x-this.source.x)-Math.PI/2
        );
        this.arrowHead.rotation.copy(dirEuler);
        this.arrowBody.rotation.copy(dirEuler);

        let dir = new Vector3(
            this.destination.x-this.source.x,
            this.destination.y-this.source.y,
            this.destination.z-this.source.z
        ).normalize();

        this.arrowHead.scale.setY(Config.messageArrowHeadLength);
        this.arrowHead.position.copy(dir).multiplyScalar((this._length-Config.messageArrowHeadLength)/2-Config.lifelineRadius);
        
        this.arrowBody.scale.setY(this._length - Config.lifelineRadius*2 - Config.messageArrowHeadLength + Config.messageArrowOverlap); 
        this.arrowBody.position.copy(dir).multiplyScalar(-Config.lifelineRadius);

    }

    public setSource(source:Vector3){
        this.source.copy(source);
        this.redraw();
    }

    public setDestination(dest:Vector3){
        this.destination.copy(dest);
    }

    public resetPosition(){
        this.updateLayout(this.index);
    }

}
