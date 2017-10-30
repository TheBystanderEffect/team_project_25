import { PlaneGeometry, MeshLambertMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";

export class LayerView extends GraphicElement{
    //mesh.metadata.parent: LayerView;
    //parent: Layer;//binis objekt already defined in GraphicElement

    public constructor(x: number, y: number, z: number, width: number, height: number) {
        super();
        this.geometry = new PlaneGeometry(width,height);
        this.material = new MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.1});
        this.mesh = new CustomMesh(this.geometry,this.material);
        this.mesh.position.set(x,y,z)
        this.mesh.metadata = {}
        this.mesh.metadata.parent=this
        //this.position = new Vector3(x,y,z);
        //this.type = 1 //obsolete

        return this;
    }    


    public layer_simple(layerNumber: number): LayerView{
        return new LayerView(0,0,-1000*layerNumber,500,600);
    }

    

}

