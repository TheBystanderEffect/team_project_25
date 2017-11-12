import {Lifeline} from "./Lifeline";

export class OccurenceSpecification{
    
	_at:Lifeline;

	constructor(at:Lifeline,){
		this._at = at;
	}

	public get at():Lifeline{
		return this._at;
	}

	public set at(at:Lifeline){
		this._at = at;
	}

}