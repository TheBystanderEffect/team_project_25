import { TextGeometry, MeshBasicMaterial, Mesh, Scene, Vector3, Object3D, PlaneGeometry, Vector } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { FONT, ASSETS } from "../globals";
import * as Config from "../config"
import * as THREE from 'three';

export class Text3D extends Object3D{

    private _link: GraphicElement;
    private displayText: string;
    private textmeshFront: CustomMesh;
    private textmeshBack: CustomMesh;
    private backPlane: CustomMesh;
    private width: number; 
    
    public constructor(link: GraphicElement) {
        super();
        this._link = link;
        this.displayText = "";
        this.textmeshFront = null;
        this.textmeshBack = null;

        this.backPlane = new CustomMesh(
            ASSETS.textBackPlateGeometry,
            ASSETS.textBackPlateMaterial
        )
        this.backPlane.scale.set(0,0,0)//temp measure to not show before text added

        this.add(this.backPlane);

        return(this);
    }

    public update(newText: string){
        if(this.displayText != newText){
            let geom = Text3D.makeText(newText);
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
            //TODO dynamic alignment of text
            let box = new THREE.Box3().setFromObject( this.textmeshFront );
            this.width = box.getSize().x;
            let height = box.getSize().y;
            this.textmeshFront.position.set(-this.width/2,-height/2,1)
            this.textmeshBack.position.set(this.width/2,-height/2,-1)
            //add new texts
            this.add(this.textmeshFront);
            this.add(this.textmeshBack);

            //dynamic scaling and positioning
            //TODO make configable
            this.backPlane.scale.set(this.width+10,height+6,1)

            this.position.set(0,3+Config.messageArrowBodyRadius+height/2,0)

        }
    }

    public getWidth(){
        return this.width;
    }

    //TODO figure changable text size
    public static makeText(textString:string):TextGeometry{
        return new TextGeometry( textString, {
            font: FONT,
            size: Config.lifelineTextSize,
            height: 1,
            curveSegments: 12,
        });
    }
}