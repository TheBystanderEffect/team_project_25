import { State } from "./State";

export class StateMachine {

    private _currentState: State;

    public get currentState(): State {
        return this._currentState;
    }

    public constructor(
        private _canvas: HTMLCanvasElement,
        initialState: State
    ) {
        this._currentState = initialState;
    }

     
    public set changeState(v : State) {
        this._currentState = v;
    }
    

}