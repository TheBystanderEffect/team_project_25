import { Vector3, Euler } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { Message } from '../model/Message';
import { LifelineView } from './LifelineView';
import * as Config from "../config"
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';
import { BusinessElement } from '../model/BusinessElement';

export class MessageView extends GraphicElement{
    private _length: number;
    //private _center: Vector3;

    private arrowBody: CustomMesh;
    private arrowHead: CustomMesh;
    private text: Text3D;

    //override
    businessElement: Message;

    public constructor(parent:BusinessElement) {
        super(parent);

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
        var start = (this.businessElement.start.lifeline.graphicElement as LifelineView).source;
        var end = (this.businessElement.end.lifeline.graphicElement as LifelineView).source;

        this._length = Math.sqrt(Math.pow(start.x-end.x,2)+Math.pow(start.y-end.y,2)+Math.pow(start.z-end.z,2));
        this.position.set(
            (start.x + end.x)/2, 
            start.y-Config.firstMessageOffset-Config.messageOffset*index,
            (start.z + end.z)/2
        );

        let dirEuler = new Euler(
            Math.atan2(end.z-start.z, end.y-start.y),
            0,
            Math.atan2(end.y-start.y, end.x-start.x)-Math.PI/2
        );
        this.arrowHead.rotation.copy(dirEuler);
        this.arrowBody.rotation.copy(dirEuler);

        let dir = new Vector3(
            end.x-start.x,
            end.y-start.y,
            end.z-start.z
        ).normalize();

        this.arrowHead.scale.setY(Config.messageArrowHeadLength);
        this.arrowHead.position.copy(dir).multiplyScalar((this._length-Config.messageArrowHeadLength)/2-Config.lifelineRadius);
        
        this.arrowBody.scale.setY(this._length - Config.lifelineRadius*2 - Config.messageArrowHeadLength + Config.messageArrowOverlap); 
        this.arrowBody.position.copy(dir).multiplyScalar(-Config.lifelineRadius);

        this.text.update(this.businessElement.name);

        return this;
    }

}
