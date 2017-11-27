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

     
    public set currentState(state : State) {
        this._currentState = state;
    }

    public acceptEvent(e: MouseEvent) {

        // iterate through transitions to find one that will accept the event
        for (let transition of this.currentState.outgoingTransitions) {
            if (transition.tryAccept(e)) {
                this.currentState = transition.target;
                break;
            }
        }

    }
    

}