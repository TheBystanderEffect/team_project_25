import { PlaneGeometry, MeshLambertMaterial, Mesh, Scene, Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';
import * as Config from "../config"

export class LayerView extends GraphicElement{
    //mesh.metadata.parent: LayerView;
    //parent: Layer;//binis objekt already defined in GraphicElement
    public width:number;
    public height:number;
    _source: Vector3; //relative top left point from center of mesh

    private rectangle: CustomMesh;
    private text: CustomMesh;

    public constructor(parent:BusinessElement) {
        super(parent);
        this.width=1;
        this.height=1;
        this._source=new Vector3(-Config.layerWidth/2,Config.layerHeight/2,0);
        //TODO pull geom and texture from some common resource
        // this.geometry = new PlaneGeometry(1,1);
        // this.material = new MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.1});
        this.rectangle = new CustomMesh(
            new PlaneGeometry(1,1),
            new MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.1})
        );
        this.add(this.rectangle);
        //TODO better text handling

        return this;
    }    

    // public constructor(parent:BusinessElement,x: number, y: number, z: number, width: number, height: number) {
    //     super(parent);
    //     this.width=width;
    //     this.height=height;
    //     this.source=new Vector3(-width/2, height/2, 0);
    //     this.geometry = new PlaneGeometry(1,1);
    //     this.material = new MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.1});
    //     this.mesh = new CustomMesh(this.geometry,this.material);
    //     this.mesh.position.set(0,0,0);
    //     this.mesh.scale.set(width,height,1);
    //     this.mesh.metadata = {};
    //     this.mesh.metadata.parent = this;
        
    //     this.position.set(x,y,z);
    //     this.add(this.mesh)
    //     //this.type = 1 //obsolete

    //     return this;
    // }    

    public updateLayout(dynamicLayerWidth:number,dynamicLayerHeight:number,index:number):LayerView{
        this.position.set(0,0,-Config.firstLayerOffset - Config.layerOffset*index);

        this.rectangle.scale.set(dynamicLayerWidth,dynamicLayerHeight,1);
        this.rectangle.position.set(dynamicLayerWidth/2-Config.layerWidth/2,-dynamicLayerHeight/2+Config.layerHeight/2,0);
        //this._source.set(-dynamicLayerWidth/2,dynamicLayerHeight/2,0);
        //--is this realy needed?--
        this.width=dynamicLayerWidth;
        this.height=dynamicLayerHeight;
        //----------maybe----------

        return this;
    }


    // public layer_simple(parent:BusinessElement,layerNumber: number): LayerView{
    //     return new LayerView(parent,0,0,-1000*layerNumber,500,600);
    // }

    get source():Vector3{
        return this._source;
    }

    // set source(source: Vector3){
    //     this._source=source;
    // }
}

