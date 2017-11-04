import { State } from "./State";

export class StateTransition {

    public constructor(
        private _source: State, 
        private _target: State
    ) {
    }

    public get source(): State {
        return this._source;
    }

    public get target(): State {
        return this._target;
    }

}