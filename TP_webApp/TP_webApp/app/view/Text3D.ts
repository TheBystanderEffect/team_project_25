import { TextGeometry, MeshBasicMaterial, Mesh, Scene, Vector3, Object3D, PlaneGeometry } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { FONT, ASSETS } from "../globals";
import * as Config from "../config"
import * as THREE from 'three';
//import {Strat} from './Text3D'
export class Text3D extends Object3D{

    private _link: GraphicElement;
    private displayText: string;
    private textmeshFront: CustomMesh;
    private textmeshBack: CustomMesh;
    private backPlane: CustomMesh;
    private strat: Strat;
    
    public constructor(link: GraphicElement, strat:Strat) {
        super();
        this._link = link;
        this.displayText = "";
        this.textmeshFront = null;
        this.textmeshBack = null;

        this.backPlane = new CustomMesh(
            ASSETS.textBackPlateGeometry,
            ASSETS.textBackPlateMaterial
        )
        this.add(this.backPlane);

        this.strat = strat;

        return(this);
    }

    public update(newText: string){
        if(this.displayText != newText){
            //empty string = no show text
            if(this.displayText == ""){
                this._link.add(this);
            }else if(newText == ""){
                this._link.remove(this);
            }
            
            let geom = new TextGeometry( newText, {
                font: FONT,
                size: this.strat.size,
                height: 1,
                curveSegments: this.strat.curveSegments,
            });
            
            let mat = ASSETS.textMaterial;
            
            this.displayText = newText;
            //remove old texts
            this.remove(this.textmeshFront);
            this.remove(this.textmeshBack);
            //create new texts
            this.textmeshFront = new CustomMesh(geom,mat);
            this.textmeshBack = new CustomMesh(geom,mat);
            //rotate the back text
            this.textmeshBack.rotateY(Math.PI)
            //dynamic alignment of text
            let box = new THREE.Box3().setFromObject( this.textmeshFront );
            let width = box.getSize().x;
            let height = box.getSize().y;
            this.textmeshFront.position.set(-width/2,-height/2,1)
            this.textmeshBack.position.set(width/2,-height/2,-1)
            //add new texts
            this.add(this.textmeshFront);
            this.add(this.textmeshBack);

            //dynamic scaling and positioning
            //TODO make configable
            this.backPlane.scale.set(width+10,height+6,1)

            this.position.set(0,3+Config.messageArrowBodyRadius+height/2,0)

            //if name is only whitespace width is 0 and text should not show
            if(width==0){
                this.update("");
            }
        }
    }

    public get viewObject():GraphicElement{
        return this._link.viewObject;
    }
}
export abstract class Strat{
    public abstract size:number;
    public abstract curveSegments:number;
}
export class LifelineStrat extends Strat{
    public size = Config.lifelineTextSize;
    public curveSegments = Config.lifelineCurveSegments;
}
export class MessageStrat extends Strat{
    public size = Config.messageTextSize;
    public curveSegments = Config.messageCurveSegments;
}