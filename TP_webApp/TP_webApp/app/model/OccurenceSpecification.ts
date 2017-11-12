import {Lifeline} from "./Lifeline";
import { Message } from "./Message";

export class OccurenceSpecification{
    
	constructor(
		private _at:Lifeline,
		private _message:Message
	){}


}