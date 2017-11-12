import { State } from "./State";
import { EventBus } from "./EventBus";

export class StateMachine {

    private _currentState: State;
    private _eventBus: EventBus;

    public get currentState(): State {
        return this._currentState;
    }

    public constructor(
        private _canvas: HTMLCanvasElement,
        initialState: State
    ) {
        this._currentState = initialState;
        this._eventBus = new EventBus(_canvas);
    }

     
    public set changeState(v : State) {
        this._currentState = v;
    }
    

}