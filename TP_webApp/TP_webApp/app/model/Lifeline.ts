import { OccurenceSpecification } from "./OccurenceSpecification";
import { LifelineView } from "../view/LifelineView";
import { TextView } from "../view/TextView";
import { Layer } from "./Layer";

export class Lifeline{
    name:string;
    type:string;
    occurenceSpecifications:OccurenceSpecification[];

    _lifelineView: LifelineView;
    _lable: TextView;
    private _layer: Layer;

    constructor(name:string,type:string,occurence:OccurenceSpecification[], layer: Layer){
        this.name = name;
        this.type = type;
        this.layer = layer;
        this.occurenceSpecifications = occurence;

    }

    get lifelineView(): LifelineView{
        return this._lifelineView;
    }

    get lable(): TextView{
        return this._lable;
    }

    set lifelineView(lifelineView: LifelineView){
        this._lifelineView = lifelineView;
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
    
    
}


    