import { Vector3, Euler } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { Message } from '../model/Message';
import { LifelineView } from './LifelineView';
import * as Config from "../config"
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';
import { BusinessElement } from '../model/BusinessElement';
import { CombinedFragment } from '../model/CombinedFragment';
import { InteractionOperand } from '../model/InteractionOperand';

export class FragmentView extends GraphicElement{
    private _widthLength: number;
    private _heighLength: number;
    //private _center: Vector3;

    private fragmentTop: CustomMesh;
    private ballTopL: CustomMesh;
    private ballTopR: CustomMesh;
    private ballBottomL: CustomMesh;
    private ballBottomR: CustomMesh;
    private fragmentLeft: CustomMesh;
    private fragmentRight: CustomMesh;
    private fragmentBottom: CustomMesh;
    private operatorText: Text3D;
    private constraintText: Text3D;
    
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
    businessElement: InteractionOperand;

    private startOffsetY: number;
    private endOffsetY: number;
    private offsetX: number;

    public constructor(parent:BusinessElement) {
        super(parent);
        this._source = new Vector3(0,0,0);
        this._destination = new Vector3(0,0,0);

        this.fragmentTop = new CustomMesh(
            ASSETS.fragmentBodyGeometry, 
            ASSETS.fragmentBodyMaterial
        );
        this.fragmentTop.position.set(0,0,0);
        this.add(this.fragmentTop)

        this.fragmentLeft = new CustomMesh(
            ASSETS.fragmentBodyGeometry, 
            ASSETS.fragmentBodyMaterial
        );
        this.fragmentLeft.position.set(0,0,0);
        this.add(this.fragmentLeft)

        this.fragmentBottom = new CustomMesh(
            ASSETS.fragmentBodyGeometry, 
            ASSETS.fragmentBodyMaterial
        );
        this.fragmentBottom.position.set(0,0,0);
        this.add(this.fragmentBottom)

        this.fragmentRight = new CustomMesh(
            ASSETS.fragmentBodyGeometry, 
            ASSETS.fragmentBodyMaterial
        );
        this.fragmentRight.position.set(0,0,0);
        this.add(this.fragmentRight)

        this.ballTopL = new CustomMesh(
            ASSETS.fragmentBallGeometry,
            ASSETS.fragmentBallMaterial
        )
        this.ballTopL.position.set(0,0,0);
        this.add(this.ballTopL);

        this.ballTopR = new CustomMesh(
            ASSETS.fragmentBallGeometry,
            ASSETS.fragmentBallMaterial
        )
        this.ballTopR.position.set(0,0,0);
        this.add(this.ballTopR);

        this.ballBottomL = new CustomMesh(
            ASSETS.fragmentBallGeometry,
            ASSETS.fragmentBallMaterial
        )
        this.ballBottomL.position.set(0,0,0);
        this.add(this.ballBottomL);

        this.ballBottomR = new CustomMesh(
            ASSETS.fragmentBallGeometry,
            ASSETS.fragmentBallMaterial
        )
        this.ballBottomR.position.set(0,0,0);
        this.add(this.ballBottomR);

        this.operatorText = new Text3D(this);
        this.add(this.operatorText);

        this.constraintText = new Text3D(this);
        this.add(this.constraintText);

        return this;
    }

    public updateLayout(startOffsetY: number,endOffsetY: number, offsetX: number):FragmentView{
        this.startOffsetY = startOffsetY;
        this.endOffsetY = endOffsetY;
        this.offsetX = offsetX;
        //calculate where the start,end points should be
        console.log(this.businessElement.startingOccurences[0]);
        
        var start = (this.businessElement.startingOccurences[0].lifeline.graphicElement as LifelineView).source.clone();

        var lastOccurence = this.businessElement.endingOccurences.length-1;
        var end = (this.businessElement.endingOccurences[lastOccurence].lifeline.graphicElement as LifelineView).source.clone();
        start.y += -Config.firstFragmentOffset-Config.fragmentOffset*startOffsetY
        end.y += -Config.firstFragmentOffset-Config.fragmentOffset*endOffsetY
        console.log(lastOccurence);
        
        // update only if current and correct points mismatch
        if( !(this._source.equals(start) && this._destination.equals(end)) ){
            this.animation.start.source.copy(this._source);
            this.animation.start.destination.copy(this._destination);
            this.animation.end.source.copy(start);
            this.animation.end.destination.copy(end);
            this.animationLength = 1;
            this.animationProgress = 0;
            // this.redraw();    
        }

        this.redraw();

        this.constraintText.updateConstraint(this.businessElement.interactionConstraint.toString());

        return this;
    }

    private redraw(){
        
        this.position.set(
            (this._source.x + this._destination.x)/2, 
            (this._source.y + this._destination.y)/2,
            (this._source.z + this._destination.z)/2
        );
        
        this._heighLength = Math.sqrt(Math.pow(this._destination.y-this._source.y,2));
        this._widthLength = Math.sqrt(Math.pow(this._destination.x-this._source.x,2));
        
        //////////////////////////////// TOP
        
        this.fragmentTop.rotation.z = Math.PI/2;

        this.fragmentTop.scale.setY(this._widthLength - Config.lifelineRadius*2 + Config.fragmentOverlap); 
        this.fragmentTop.position.copy(new Vector3(0,this._heighLength/2,5));

        //////////////////////////////// LEFT

        this.fragmentLeft.scale.setY(this._heighLength - Config.lifelineRadius*2 + Config.fragmentOverlap); 
        this.fragmentLeft.position.copy(new Vector3(-this._widthLength/2,0,5));

        //////////////////////////////// BOTTOM

        this.fragmentBottom.rotation.z = Math.PI/2;

        this.fragmentBottom.scale.setY(this._widthLength - Config.lifelineRadius*2 + Config.fragmentOverlap); 
        this.fragmentBottom.position.copy(new Vector3(0,-this._heighLength/2,5));

        //////////////////////////////// RIGHT
        
        this.fragmentRight.scale.setY(this._heighLength - Config.lifelineRadius*2 + Config.fragmentOverlap); 
        this.fragmentRight.position.copy(new Vector3(this._widthLength/2,0,5));
            
        //////////////////////////////// Ball-Top-Left

        this.ballTopL.position.copy(new Vector3(-this._widthLength/2,this._heighLength/2,5))

        //////////////////////////////// Ball-Top-Right

        this.ballTopR.position.copy(new Vector3(-this._widthLength/2,-this._heighLength/2,5))

        //////////////////////////////// Ball-Bottom-Left

        this.ballBottomL.position.copy(new Vector3(this._widthLength/2,this._heighLength/2,5))

        //////////////////////////////// Ball-Bottom-Right

        this.ballBottomR.position.copy(new Vector3(this._widthLength/2,-this._heighLength/2,5))
    }

    public resetPosition(){
        this.updateLayout(this.startOffsetY, this.endOffsetY, this.offsetX);
    }

    public get source():Vector3 {
        return this._source;
    }

    public get destination():Vector3{
        return this._destination;
    }

    public set source(source: Vector3){
        this._source.copy(source);
    }

    public set destination(destination:Vector3){
        this._destination.copy(destination);
    }

    public animate(): void {
        this.source = this.animator(
            this.animation.start.source, 
            this.animation.end.source, 
            this.animationProgress
        );
        this.destination = this.animator(
            this.animation.start.destination, 
            this.animation.end.destination, 
            this.animationProgress
        );
        this.redraw();
    }
}