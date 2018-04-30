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
import { OperandView } from './OperandView';

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

    private _height: number;
    private _width: number;

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

        this.constraintText = new Text3D(this);
        this.constraintText.position.set(0,0,0);
        this.add(this.constraintText);

        this.operatorText = new Text3D(this);
        this.operatorText.position.set(0,0,0);
        this.add(this.operatorText);

        return this;
    }

    public findStartingLifeline(){
        let l = this.businessElement.startingOccurences[0].lifeline;
        for(let occurence of this.businessElement.startingOccurences){
            if((l.graphicElement as LifelineView).curPos.x > 
            (occurence.lifeline.graphicElement as LifelineView).curPos.x){
                l = occurence.lifeline;
            }
        }
        return l;
    }

    public findEndingLifeline(){
        let l = this.businessElement.endingOccurences[0].lifeline;
        for(let occurence of this.businessElement.startingOccurences){
            if((l.graphicElement as LifelineView).curPos.x < 
            (occurence.lifeline.graphicElement as LifelineView).curPos.x){
                l = occurence.lifeline;
            }
        }
        return l;
    }

    public updateLayout(startOffsetY: number, endOffsetY?: number, offsetX?: number):FragmentView{
        this.startOffsetY = startOffsetY;
        this.endOffsetY = endOffsetY;
        this.offsetX = offsetX + 2; /// +2
      

        // console.log(this.businessElement.interactionConstraint);
        // console.log(offsetX);
        
        //calculate where the start,enstartOffsetYd points should be
        // console.log(this.businessElement.startingOccurences[0]);
        
        var start = (this.findStartingLifeline().graphicElement as LifelineView).curPos;       
        var end = (this.findEndingLifeline().graphicElement as LifelineView).curPos;
        start.y += -Config.firstFragmentOffset-Config.fragmentOffset*startOffsetY
        end.y += -Config.firstFragmentOffset-Config.fragmentOffset*endOffsetY
        start.x -= this.offsetX * 10;
        end.x += this.offsetX * 10;
        // console.log(lastOccurence);
        
        // update only if current and correct points mismatch
        if( !(this._source.equals(start) && this._destination.equals(end)) ){
            if(this.shouldAnimate){
                this.animation.start.source.copy(this._source);
                this.animation.start.destination.copy(this._destination);
                this.animation.end.source.copy(start);
                this.animation.end.destination.copy(end);
                this.animationLength = 0.4;
                this.animationProgress = 0;
            }else{
                this._source.copy(start);
                this._destination.copy(end);
                this.redraw();
            }
        }
        
        this.constraintText.update(this.businessElement.interactionConstraint.toString());
        if(this.businessElement.parent.children[0] == this.businessElement){
            this.operatorText.update(this.businessElement.parent.interactionOperator.toString());
        }
        this.redraw();

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
        
        this.height = this._heighLength;
        this.width = this._widthLength;

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

        //////////////////////////////// Constraint position

        this.constraintText.position.copy(new Vector3(0,this._heighLength/2-Config.fragmentTextSize,Config.lifelineRadius));

        //////////////////////////////// Operator position

        this.operatorText.position.copy(new Vector3(-this._widthLength/2+this.operatorText.getWidth()/2+Config.fragmentBallRadius,this._heighLength/2-Config.fragmentTextSize,Config.lifelineRadius));
    }

    public redrawBySource(source:Vector3){
        this._source.copy(source);
        // this._destination.setY(source.y);
        this.redraw();
    }

    public redrawByDestination(dest:Vector3){
        this._destination.copy(dest);
        // this._source.setY(dest.y);
        this.redraw();
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

    public getTop(){
        return this.position.y+this.height/2;
    }

    public getBottom(){
        return this.position.y-this.height/2;
    }

    public getRight(){
        return this.position.x+this.width/2;
    }

    public getLeft(){
        return this.position.x-this.width/2;
    }

    public getIndexStart(){
        return this.startOffsetY;
    }

    public getIndexEnd(){
        return this.endOffsetY;
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

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    public set width(width: number) {
        this._width = width;
    }

    public set height(height: number) {
        this._height = height;
    }
}