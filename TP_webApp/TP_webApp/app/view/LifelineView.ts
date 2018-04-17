import { Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { Lifeline } from '../model/Lifeline';
import * as Config from "../config"
import { LayerView } from './LayerView';
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';
import { BusinessElement } from '../model/BusinessElement';
import { MessageView } from './MessageView';
import { MessageOccurenceSpecification, OperandOccurenceSpecification, OccurenceSpecification } from '../model/OccurenceSpecification';
import { FragmentView } from './FragmentView';

export class LifelineView extends GraphicElement {

    private line: CustomMesh;
    private text: Text3D;

    //override of object3D parent
    parent: LayerView;
    //override
    businessElement: Lifeline;

    private animation = {
        start:{pos: new Vector3(0,0,0)},
        end:{pos: new Vector3(0,0,0)}}

    public constructor(parent: BusinessElement) {
        super(parent);
        this.line = new CustomMesh(
            ASSETS.lifelineBodyGeometry,
            ASSETS.lifelineBodyMaterial
        );
        this.add(this.line);
        
        this.text = new Text3D(this);
        this.add(this.text);
    }

    public updateLayout(index: number): LifelineView {
        
        if(this.shouldAnimate){
            this.animation.start.pos = this.position.clone();
            this.animation.end.pos.set(
                this.parent.source.x + Config.firstLifelineOffsetX + Config.lifelineOffsetX*index,
                this.parent.source.y - Config.lifelineOffsetY,
                0);
            this.animationLength = 0.4;
            this.animationProgress = 0;
        }else{
            this.position.set(
                this.parent.source.x + Config.firstLifelineOffsetX + Config.lifelineOffsetX*index,
                this.parent.source.y - Config.lifelineOffsetY,
                0);
        }
            
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

    get curPos():Vector3{
        if(this.shouldAnimate){
            return this.animation.end.pos.clone();
        }
        return this.position.clone();
    }

    public animate(): void {
        this.position.copy(this.animator(
            this.animation.start.pos, 
            this.animation.end.pos, 
            this.animationProgress
        ));
    }

    public updateFragments():void{
        let occurences = this.businessElement.occurenceSpecifications
        .filter(e => e instanceof OperandOccurenceSpecification)
        .map(e => (e as OperandOccurenceSpecification));

        occurences.forEach( occ => {
            if(occ.startsOperand){
                if((occ.startsOperand.graphicElement as FragmentView).findStartingLifeline() != this.businessElement){
                    let t = (occ.startsOperand.graphicElement as FragmentView).destination.clone();
                    t.x=this.source.x;
                    (occ.startsOperand.graphicElement as FragmentView).redrawByDestination(t);
                }else{
                    let t = (occ.startsOperand.graphicElement as FragmentView).source.clone();
                    t.x=this.source.x;
                    (occ.startsOperand.graphicElement as FragmentView).redrawBySource(t);
                }
            } else {
                if((occ.endsOperand.graphicElement as FragmentView).findStartingLifeline() != this.businessElement){
                    let t = (occ.endsOperand.graphicElement as FragmentView).destination.clone();
                    t.x=this.source.x;
                    (occ.endsOperand.graphicElement as FragmentView).redrawByDestination(t);
                }else{
                    let t = (occ.endsOperand.graphicElement as FragmentView).source.clone();
                    t.x=this.source.x;
                    (occ.endsOperand.graphicElement as FragmentView).redrawBySource(t);
                }
            }
        });
    }

    public updateMessages():void{
        this.businessElement.occurenceSpecifications
        .filter(e=>e instanceof MessageOccurenceSpecification)
        .map(e=>(e as MessageOccurenceSpecification).message.graphicElement as MessageView)
        .forEach(element => {
            if(element.businessElement.start.lifeline != this.businessElement){
                let t = element.destination.clone();
                t.x=this.source.x;
                element.redrawByDestination(t);
            }else{
                let t = element.source.clone();
                t.x=this.source.x;
                element.redrawBySource(t);
            }
        });

    }
}