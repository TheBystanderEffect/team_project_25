import { PlaneGeometry, MeshLambertMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';

export class LayerView extends GraphicElement{
    //mesh.metadata.parent: LayerView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    public width:number;
    public height:number;
    _source: Vector3; //relative top left point from center of mesh

    public constructor(parent:BusinessElement,x: number, y: number, z: number, width: number, height: number) {
        super(parent);
        this.width=width;
        this.height=height;
        this.source=new Vector3(-width/2, height/2, 0);
        this.geometry = new PlaneGeometry(1,1);
        this.material = new MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.1});
        this.mesh = new CustomMesh(this.geometry,this.material);
        this.mesh.position.set(0,0,0);
        this.mesh.scale.set(width,height,1);
        this.mesh.metadata = {};
        this.mesh.metadata.parent = this;
        
        this.position.set(x,y,z);
        this.add(this.mesh)
        //this.type = 1 //obsolete

        return this;
    }    


    public layer_simple(parent:BusinessElement,layerNumber: number): LayerView{
        return new LayerView(parent,0,0,-1000*layerNumber,500,600);
    }

    get source():Vector3{
        return this._source;
    }

    set source(source: Vector3){
        this._source=source;
    }
}

