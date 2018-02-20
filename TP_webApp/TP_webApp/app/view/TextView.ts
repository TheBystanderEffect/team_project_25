import { TextGeometry, MeshBasicMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { FONT } from "../globals"
import { BusinessElement } from '../model/BusinessElement';
import * as Config from "../config"


//to be majorly changed, dunno how yet but it sure gonna get messed up
export class TextView extends GraphicElement{
    //mesh.metadata.parent: MessageView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    //public length: number;
    //public center: Vector3;

    //this should not be used, i think
    //yup, should not be used
    public constructor(parent:BusinessElement,source_x:number, source_y:number, source_z:number, text_string:string, text_size:number) {
        super(parent);
        this.geometry = new TextGeometry( text_string, {
                font: FONT,
                size: text_size,
                height: 1,
                curveSegments: 12,
            })
        this.material = new MeshBasicMaterial({color: 0x000000});
        this.mesh = new CustomMesh(this.geometry,this.material)
        this.mesh.position.set(source_x, source_y, source_z)

        //this.mesh.metadata = {}
        this.mesh.metadata.parent=this

        this.add(this.mesh);
        this.position.set(0,0,0);

        return(this);
    }

    //this' the stuff for time being
    public static makeText(textString:string):TextGeometry{
        return new TextGeometry( textString, {
            font: FONT,
            size: Config.lifelineTextSize,
            height: 1,
            curveSegments: 12,
        });
    }
}