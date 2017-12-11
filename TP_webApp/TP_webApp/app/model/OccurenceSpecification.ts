import {Lifeline} from "./Lifeline";
import { Message } from "./Message";

export class OccurenceSpecification{
    
	constructor(
		private _at:Lifeline,
		private _message:Message
	){}

	public get at():Lifeline{
		return this._at;
	}

	public set at(at:Lifeline){
		this._at = at;
	}

	public get message(): Message {
		return this._message;
	}

	public set message(message: Message) {
		this._message = message;
	}

	// constructor(at:Lifeline){
	// 	this.at = at;
	// }
}