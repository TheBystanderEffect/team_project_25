import { Vector3 } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { BusinessElement } from '../model/BusinessElement';
import * as Config from "../config"
import { ASSETS } from "../globals";
import { Layer } from '../model/Layer';

export class LayerView extends GraphicElement{

    _source: Vector3; //top left position is stable
    //position does not change, layer expands right, children are added to this

    private rectangle: CustomMesh;
    public businessElement: Layer;

    private animation = {
        start:{pos: new Vector3(0,0,0)},
        end : {pos: new Vector3(0,0,0)}}

    public constructor(layer:Layer) {
        super(layer);
        this._source=new Vector3(-Config.layerWidth/2,Config.layerHeight/2,0);
        this.rectangle = new CustomMesh(
            ASSETS.layerRectangleGeometry,
            ASSETS.layerRectangleMaterial
        );
        this.add(this.rectangle);

        return this;
    }    

    public updateLayout(index:number):LayerView{
        var dynamicLayerWidth = Config.firstLifelineOffsetX +
            (this.businessElement.lifelines.length - 1) * Config.lifelineOffsetX +
            Config.firstLifelineOffsetX;
        if(dynamicLayerWidth < Config.layerWidth){
            dynamicLayerWidth = Config.layerWidth;
        }

        var dynamicLayerHeight = Config.lifelineOffsetY + 
            Config.firstMessageOffset + 
            (this.businessElement.messages.length - 1) * Config.messageOffset
            +Config.firstMessageOffset;
        if(dynamicLayerHeight < Config.layerHeight){
            dynamicLayerHeight = Config.layerHeight;
        }
        
        if(this.shouldAnimate){
            this.animation.start.pos.copy(this.position);
            this.animation.end.pos.set(0,0,-Config.firstLayerOffset - Config.layerOffset*index);
            this.animationProgress=0;
        }else{
            this.position.set(0,0,-Config.firstLayerOffset - Config.layerOffset*index);
        }
    
        this.rectangle.scale.set(dynamicLayerWidth,dynamicLayerHeight,1);
        this.rectangle.position.set(dynamicLayerWidth/2-Config.layerWidth/2,-dynamicLayerHeight/2+Config.layerHeight/2,0);
        //this._source.set(-dynamicLayerWidth/2,dynamicLayerHeight/2,0);

        return this;
    }

    public animate(): void {
        this.position.copy(this.animator(
            this.animation.start.pos, 
            this.animation.end.pos, 
            this.animationProgress
        ));
    }

    public get source():Vector3{
        return this._source.clone();
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

