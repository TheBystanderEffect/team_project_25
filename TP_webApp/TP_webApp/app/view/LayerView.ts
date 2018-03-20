import { Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';
import * as Config from "../config"
import { ASSETS } from "../globals";

export class LayerView extends GraphicElement{
    //done by getters, also needed
    //public width: number;
    //public height: number;

    _source: Vector3; //relative top left point from center of mesh
    //^not sure what is it for

    private rectangle: CustomMesh;
    private text: CustomMesh;

    public constructor(parent:BusinessElement) {
        super(parent);
        //this.width=1;
        //this.height=1;
        this._source=new Vector3(-Config.layerWidth/2,Config.layerHeight/2,0);
        this.rectangle = new CustomMesh(
            ASSETS.layerRectangleGeometry,
            ASSETS.layerRectangleMaterial
        );
        this.add(this.rectangle);
        //TODO better text handling

        return this;
    }    

    public updateLayout(dynamicLayerWidth:number,dynamicLayerHeight:number,index:number):LayerView{
        this.position.set(0,0,-Config.firstLayerOffset - Config.layerOffset*index);

        this.rectangle.scale.set(dynamicLayerWidth,dynamicLayerHeight,1);
        this.rectangle.position.set(dynamicLayerWidth/2-Config.layerWidth/2,-dynamicLayerHeight/2+Config.layerHeight/2,0);
        //this._source.set(-dynamicLayerWidth/2,dynamicLayerHeight/2,0);
        //not needed,probably
        //this.width=dynamicLayerWidth;
        //this.height=dynamicLayerHeight;

        return this;
    }

    get source():Vector3{
        return this._source;
    }

    public get width():number{
        return this.rectangle.scale.x;
    }
    public get height():number{
        return this.rectangle.scale.y;
    }

    public getRectangleCenter():Vector3{
        return this.rectangle.position.clone();
    }
}

