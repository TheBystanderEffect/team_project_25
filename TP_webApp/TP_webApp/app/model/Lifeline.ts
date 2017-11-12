import { OccurenceSpecification } from "./OccurenceSpecification";
import { LifelineView } from "../view/LifelineView";
import { TextView } from "../view/TextView";

export class Lifeline{
    name:string;
    type:string;
    occurenceSpecifications:OccurenceSpecification[];

    _lifelineView: LifelineView;
    _lable: TextView;

    constructor(name:string,type:string,occurence:OccurenceSpecification[]){
        this.name = name;
        this.type = type;
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
}


    