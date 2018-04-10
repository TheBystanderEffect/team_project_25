import { State } from "./State";
import { StateTransition } from "./StateTransition";
import { EventType } from "./EventBus";
export const stateNeutral = new State('NEUTRAL');
export const stateButton = new State('BUTTON');
export const stateClicked = new State('CLICKED');
export const stateDragged = new State('DRAGGED');
export const stateDialog = new State('DIALOG');
export const stateClickedInternal = new State('CLICK_INTERNAL');
export class StateSequence {
    constructor(name, sequencePool, sourceState) {
        this.name = name;
        this.sequencePool = sequencePool;
        this.sourceState = sourceState;
        this.order = 0;
        this.linked = false;
        this.state = null;
        this.condition = () => true;
        this.action = () => {
            throw new Error("State transition with default action");
        };
        sequencePool.push(this);
    }
    static start(name) {
        let newSeq = new StateSequence(name, [], null);
        newSeq.state = stateNeutral;
        newSeq.linked = true;
        return newSeq;
    }
    click(condition, action) {
        let newSeq = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateClicked.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event, hits, eventType) => {
            return eventType == EventType.MOUSE_DOWN && condition(event, hits);
        };
        newSeq.action = action;
        newSeq.order = this.order + 1;
        return newSeq;
    }
    drag(condition, success, failure, cleanup, update, fallbackState) {
        let newSeq = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateDragged.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event, hits, eventType) => {
            return eventType == EventType.MOUSE_UP && condition(event, hits);
        };
        newSeq.action = (e, h) => { success(e, h); cleanup(e, h); };
        let failSeq = new StateSequence(this.name, this.sequencePool, this.state);
        failSeq.state = fallbackState.state;
        failSeq.condition = (event, hits, eventType) => {
            return eventType == EventType.MOUSE_UP && !condition(event, hits);
        };
        failSeq.action = (e, h) => { failure(e, h); cleanup(e, h); };
        let updateSeq = new StateSequence(this.name, this.sequencePool, this.state);
        updateSeq.state = this.state;
        updateSeq.condition = (event, hits, eventType) => eventType == EventType.MOUSE_MOVE;
        updateSeq.action = update;
        return newSeq;
    }
    mousemove(fallback, callback) {
        let newSeq = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = null;
        return null;
    }
    button(buttonId) {
        let newSeq = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateButton.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event, hits, eventType) => eventType == EventType.BUTTON && event.target.id == buttonId;
        newSeq.action = () => { };
        newSeq.order = this.order + 1;
        return newSeq;
    }
    dialog(callback) {
        throw new Error("Not implemented yet");
    }
    finish(action) {
        let newSeq = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateNeutral;
        newSeq.condition = (event, hits, eventType) => eventType == EventType.SCENE_UPDATE;
        newSeq.action = action;
        newSeq.order = this.order + 1;
        for (let seq of this.sequencePool) {
            seq.link();
        }
    }
    timer(timeout, callback) {
        throw new Error("Not implemented yet");
        //dont forget to check if we are in original state at callback execution
    }
    link() {
        if (this.linked) {
            return;
        }
        let transition = new StateTransition(this.sourceState, this.state, this.condition, this.action);
        transition.source.registerOutgoingTransition(transition);
        transition.target.registerIncomingTransition(transition);
        this.linked = true;
    }
}
//# sourceMappingURL=StateMachineBuilder.js.map