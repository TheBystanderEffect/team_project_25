import { State } from "./State";
import { EventBus, EventType } from "./EventBus";
import { CustomMesh } from "../view/CustomMesh";
import { RaycastControl } from "./RaycastControl";
import { GLContext } from "../view/GLContext";

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
        this._eventBus = new EventBus(_canvas, this.acceptEvent.bind(this));
    }

     
    public set currentState(state: State) {
        this._currentState = state;
    }

    public acceptEvent(e: MouseEvent, eventType: EventType) {

        let hits: CustomMesh[] = RaycastControl.instance.cast(GLContext.instance.camera, GLContext.instance.scene, e);

        // iterate through transitions to find one that will accept the event
        for (let transition of this.currentState.outgoingTransitions) {
            if (transition.tryAccept(e, hits, eventType)) {
                this.currentState = transition.target;
                break;
            }
        }

    }
    

}