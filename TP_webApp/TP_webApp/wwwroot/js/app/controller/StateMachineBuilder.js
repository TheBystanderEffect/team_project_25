import { State } from "./State";
import { StateTransition } from "./StateTransition";
export const stateNeutral = new State('NEUTRAL');
export const stateButton = new State('BUTTON');
export const stateClicked = new State('CLICKED');
export const stateDragged = new State('DRAGGED');
export const stateDialog = new State('DIALOG');
export class StateSequence {
    constructor(name, preceding) {
        this.name = name;
        this.preceding = preceding;
        this.order = 0;
        this.linked = false;
        this.state = null;
        this.condition = () => true;
        this.action = () => {
            throw new Error("State transition with default action");
        };
    }
    static start(name) {
        let newSeq = new StateSequence(name, null);
        newSeq.state = stateNeutral;
        newSeq.linked = true;
        return newSeq;
    }
    click(condition, action) {
        let newSeq = new StateSequence(this.name, this);
        newSeq.state = stateClicked.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = condition;
        newSeq.action = action;
        newSeq.order = this.order + 1;
        return newSeq;
    }
    drag(condition, action, cleanup) {
        throw new Error("Not yet implemented");
        // let newSeq: StateSequence = new StateSequence(this.name, this);
        // newSeq.state = stateDragged.specialize(newSeq.name + '_' + this.order);
        // newSeq.condition = condition;
        // newSeq.action = action;
        // newSeq.order = this.order + 1;
        // // TODO add cleanup
        // return newSeq;
    }
    button(buttonId) {
        let newSeq = new StateSequence(this.name, this);
        newSeq.state = stateButton.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event) => !!event.target.id.match(buttonId);
        newSeq.action = () => { };
        newSeq.order = this.order + 1;
        return newSeq;
    }
    dialog(callback) {
        throw new Error("Not implemented yet");
    }
    finish(action) {
        this.state = stateNeutral;
        let thisAct = this.action;
        this.action = (event, hits) => {
            thisAct(event, hits);
            action(event, hits);
        };
        this.link();
    }
    link() {
        if (this.linked) {
            return;
        }
        let transition = new StateTransition(this.preceding.state, this.state, this.condition, this.action);
        transition.source.registerOutgoingTransition(transition);
        transition.target.registerIncomingTransition(transition);
        this.linked = true;
        this.preceding.link();
    }
}
//# sourceMappingURL=StateMachineBuilder.js.map