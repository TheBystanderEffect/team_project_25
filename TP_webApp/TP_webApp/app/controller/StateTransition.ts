import { State } from "./State";

export class StateTransition {

    public constructor(
        private _source: State, 
        private _target: State,
        private _condition: (e: Event) => boolean,
        private _action: (e: Event) => void
    ) {
    }

    public get source(): State {
        return this._source;
    }

    public get target(): State {
        return this._target;
    }

    public tryAccept(e: MouseEvent): boolean {
        if (!this._condition(e)) {
            return false;
        }

        this._action(e);
        return true;
    }

}