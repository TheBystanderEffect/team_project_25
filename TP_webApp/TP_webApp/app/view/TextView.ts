import { TextGeometry, MeshBasicMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { FONT } from "../globals"

export class MessageView extends GraphicElement{
    //mesh.metadata.parent: MessageView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    public length: number;
    public center: Vector3;

    public constructor(source_x, source_y, source_z, text_string, font, text_size) {
        super();
        this.geometry = new TextGeometry( text_string, {
                font: font,
                size: text_size,
                height: 1,
                curveSegments: 12,
            })
        this.material = new MeshBasicMaterial({color: 0x000000});
        this.mesh = new CustomMesh(this.geometry,this.material)
        this.mesh.position.set(source_x, source_y, source_z)

        this.mesh.metadata = {}
        this.mesh.metadata.parent=this

        return(this);
    }
}