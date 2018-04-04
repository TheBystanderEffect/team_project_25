import { EventBus } from "./EventBus";
import { RaycastControl } from "./RaycastControl";
import { GLContext } from "../view/GLContext";
export class StateMachine {
    constructor(_canvas, initialState) {
        this._canvas = _canvas;
        this._currentState = initialState;
        this._eventBus = new EventBus(_canvas, this.acceptEvent.bind(this));
    }
    get currentState() {
        return this._currentState;
    }
    set currentState(state) {
        this._currentState = state;
    }
    acceptEvent(e, eventType) {
        let hits = null;
        if (e != null) {
            hits = RaycastControl.instance.cast(GLContext.instance.camera, GLContext.instance.scene, e);
        }
        // iterate through transitions to find one that will accept the event
        for (let transition of this.currentState.outgoingTransitions) {
            if (transition.tryAccept(e, hits, eventType)) {
                this.currentState = transition.target;
                break;
            }
        }
    }
}
//# sourceMappingURL=StateMachine.js.map