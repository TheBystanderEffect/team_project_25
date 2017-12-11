import { State } from "./State";
import { CustomMesh } from "../view/CustomMesh";

export class StateTransition {

    public constructor(
        private _source: State, 
        private _target: State,
        private _condition: (e: Event, rayhits: CustomMesh[]) => boolean,
        private _action: (e: Event, rayhits: CustomMesh[]) => void
    ) {
    }

    public get source(): State {
        return this._source;
    }

    public get target(): State {
        return this._target;
    }

    public set source(state: State) {
        this._source = state;
    }

    public set target(state: State) {
        this._target= state;
    }

    public tryAccept(e: MouseEvent, hits: CustomMesh[]): boolean {
        if (!this._condition(e, hits)) {
            return false;
        }

        this._action(e, hits);
        return true;
    }

}