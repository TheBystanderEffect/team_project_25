import { OccurenceSpecification } from "./OccurenceSpecification";
import { LifelineView } from "../view/LifelineView";
import { TextView } from "../view/TextView";
import { Layer } from "./Layer";
import { BusinessElement } from "./BusinessElement";

export class Lifeline extends BusinessElement{
    name:string;
    type:string;
    occurenceSpecifications:OccurenceSpecification[];

    _lable: TextView;
    private _layer: Layer;

    constructor(name:string,type:string,occurence:OccurenceSpecification[], layer: Layer){
        super();
        this.name = name;
        this.type = type;
        this.layer = layer;
        this.occurenceSpecifications = occurence;

    }

    get lable(): TextView{
        return this._lable;
    }
    
    set lable(lable: TextView){
        this._lable = lable;
    }

    
    public get layer() : Layer {
        return this._layer;
    }

    
    public set layer(v : Layer) {
        this._layer = v;
    }
    
    AddOccurenceSpecification(occurenceSpecification:OccurenceSpecification){
        this.occurenceSpecifications.push(occurenceSpecification);
    }
}


    